var newtabURL = "chrome://newtab/"

chrome.tabs.onCreated.addListener(onTabCreated);

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

  chrome.tabs.highlight({tabs: duplicates[0].index}, function() {
    // Close our new tab
    chrome.tabs.remove(tab.id)
    console.log("Tab highlighted");
  });
}

// Finds tabs with similar urls across windows.
// TODO: Add toggle option to limit closing of duplicate tabs
// across windows, or only to the current one. 
function findDuplicateTabs(tab, callback) {
  chrome.windows.getCurrent({populate: true, windowTypes: ['normal']}, function(windw) {
    var dups = [];
    var targetDomain = getDomain(tab.url);
    console.log("Original Tab: " + tab.id);

    // TODO: Assert window still contains our tab
    for(var i = 0; i < windw.tabs.length; i++) {
      var tmpTab = windw.tabs[i];

      // GUARD: Skip our original tab
      if(tmpTab.id == tab.id) { continue; }

      // Add tab to duplicates if domain is the same.
      // TODO: Give the user an option to match by domain
      // or more specificity (domain + path, etc...)
      tmpDomain = getDomain(tmpTab.url);
      if(tmpDomain == targetDomain) {
        console.log("Duplicate Tab: " + tmpTab.id);
        dups.push(tmpTab);
      }
    }

    callback(dups);
  })
}

// http://stackoverflow.com/questions/12220345/how-to-compare-two-urls-in-javascript-or-jquery
function getDomain(url) {
  var prefix = /^https?:\/\//i;
  var domain = /^[^\/]+/;
  url = url.replace(prefix, "");

  var match = url.match(domain);
  if (match) {
    return(match[0]);
  }
  return(null);
}
