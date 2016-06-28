if (chrome.runtime && chrome.runtime.onStartup) {
  chrome.runtime.onStartup.addListener(function() {
    chrome.tabs.onUpdated.addListener(onTabUpdated)
  });
}

chrome.tabs.onCreated.addListener(onTabCreated)

function onTabCreated(tab) {
  if(tab.active) {
    var tabId = tab.id;
    chrome.tabs.onUpdated.addListener(function(id, changeInfo, tab) {
      // Make sure this is our newly created tab
      if(id === tabId) {
        findDuplicateTabs(tab);
      }
    })
  }
}

function findDuplicateTabs(tab) {
}
