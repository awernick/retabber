(function() {

  window.retabber = window.retabber || {};

  var newtabURL = "chrome://newtab/";
  var prefStore = new retabber.PrefStore;

  var searchScope   = null,
      closeNew      = null,
      closeExisting = null,
      whitelist     = null;


  function setPreferences(prefs) {
    searchScope   = prefs.searchScope;
    closeNew      = prefs.closeNew;
    closeExisting = prefs.closeExisting;
    whitelist     = prefs.whitelist;
  }

  function main() {
    prefStore.getAll(setPreferences);
    prefStore.addListener(setPreferences);

    chrome.tabs.onCreated.addListener(onTabCreated);
  }

  function onTabCreated(tab) {
    if(tab.active) {
      var tabId = tab.id
        // Wait for our current tab to be updated with a URL.
        chrome.tabs.onUpdated.addListener(function onTabUpdated(id, changeInfo, tab) {
          if(id === tabId) {
            // GUARD: Wait for tab URL.
            if(tab.url == newtabURL || !'url' in changeInfo) { return }

            // Remove listener to avoid duplicate events.
            chrome.tabs.onUpdated.removeListener(onTabUpdated);
            console.log("URL: " + tab.url);
            
            // Filter whitelist
            if(inWhitelist(tab.url)) { return }

            findDuplicateTabs(tab, function(dupTabs) {
              handleDuplicateTabs(tab, dupTabs);
            });
          }
        })
    }
  }

  //TODO: Error handling if dup tab could not be highlighted.
  function handleDuplicateTabs(tab, duplicates) {

    // GUARD: The current tab will be kept open if
    // we can't find duplicate tabs
    if(duplicates.length == 0) { return }

    var dupWindow = duplicates[0].window;
    var dupTab    = duplicates[0].tab;

    chrome.tabs.highlight({
      windowId: dupWindow.id,
      tabs: dupTab.index
    }, function() {
      // Close our new tab
      chrome.tabs.remove(tab.id)
        console.log("Tab highlighted");
    });

    // Request focus of different window
    if(dupWindow.id != tab.windowId) {
      chrome.windows.update(dupWindow.id, { focused: true })
    }
  }

  // Finds tabs with similar urls across windows.
  function findDuplicateTabs(tab, callback) {

    if(searchScope == "active") {
      var func = chrome.windows.getCurrent;
    } else if (searchScope == "all") {
      var func = chrome.windows.getAll;
    }

    func({populate: true, windowTypes: ['normal']}, function(windows) {
      var dups = [];
      var targetDomain = getDomain(tab.url);
      console.log("Original Tab: " + tab.id);

      // Convert single Window into Window array
      if(!(windows instanceof Array)) {
        windows = [windows];
      } 

      // TODO: Assert window still contains our tab
      for(var i = 0; i < windows.length; i++) {
        for(var j = 0; j < windows[i].tabs.length; j++) {
          var tmpTab = windows[i].tabs[j];

          // GUARD: Skip our original tab
          if(tmpTab.id == tab.id) { continue; }

          // Add tab to duplicates if domain is the same.
          // TODO: Give the user an option to match by domain
          // or more specificity (domain + path, etc...)
          tmpDomain = getDomain(tmpTab.url);
          if(tmpDomain == targetDomain) {
            console.log("Duplicate Tab: " + tmpTab.id);
            dups.push({
              tab: tmpTab,
              window: windows[i]
            });
          }
        }
      }

      callback(dups);
    })
  }

  function inWhitelist(url) {
    var protocol = getProtocol(url);

    if(protocol == "chrome" ||
       protocol == "chrome-extension") {
      return true;
    }

    return false;
  }

  main();
})();
