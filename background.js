if (chrome.runtime && chrome.runtime.onStartup) {
  chrome.runtime.onStartup.addListener(function() {
    chrome.tabs.onCreated.addListener(onTabCreated)
  });
}

chrome.tabs.onCreated.addListener(onTabCreated)

function onTabCreated(tab) {
  if(tab.active) {
    var tabId = tab.id;
    // Wait for our current tab to be updated with a URL.
    chrome.tabs.onUpdated.addListener(function onTabUpdated(id, changeInfo, tab) {
      // Make sure this our newly created tab has a URL
      if(id === tabId && tab.url != "chrome://newtab/") {
        // Only process if URL has changed.
        if(!'url' in changeInfo) { return } 

        // Remove listener to avoid duplicate events.
        chrome.tabs.onUpdated.removeListener(onTabUpdated);

        console.log("Our tab has been updated");
        console.log("URL: " + tab.url);

        // The current tab will be kept open if
        // there aren't any duplicate tabs
        findDuplicateTabs(tab, function(dupTabs) {
          console.log("Our tabs have been found.");
          if(dupTabs.length != 0) {
            handleDuplicateTabs(tab, dupTabs);
          }
        });
      }
    })
  }
}

function onTabUpdated(id, changeInfo, tab) {
}

//TODO: Error handling if dup tab could not be highlighted.
function handleDuplicateTabs(tab, duplicates) {
  chrome.tabs.highlight({tabs: duplicates[0].index}, function() {
    console.log("Tab highlighted");

    // Close our new tab
    chrome.tabs.remove(tab.id)
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

      // Skip our original tab
      if(tmpTab.id == tab.id) { continue; }

      // Add tab to duplicates if domain is the same.
      // TODO: Give the user an option to match by domain
      // or more specificity (domain + path, etc...)
      tmpDomain = getDomain(tmpTab.url);
      if(tmpDomain == targetDomain) {
        console.log("Duplicated Tab: " + tmpTab.id);
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
