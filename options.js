document.addEventListener("DOMContentLoaded", function() {
  restoreOptions();

  // Save Action
  var save = document.getElementById("save");
  save.addEventListener("click", saveOptions);

  // Cancel Action
  var cancel = document.getElementById("cancel");
  cancel.addEventListener("click", function(){
    // Close option tab without persisting
    chrome.tabs.getCurrent(function(tab) {
      chrome.tabs.remove(tab.id)
    })
  });
})

function saveOptions() {
  var searchScope   = document.getElementById("search-scope").value,
      closeNew      = document.getElementById("close-new").checked,
      closeExisting = document.getElementById("close-existing").checked, 
      whitelist     = document.getElementById("whitelist").value;
  var status        = document.getElementById("status");

  chrome.storage.sync.set({
    searchScope: searchScope,
    closeNew: closeNew,
    closeExisting: closeExisting,
    whitelist: whitelist
  }, function() {
    status.textContent = "Your options have been saved!";

    setTimeout(function() {
      status.textContent = "";
    }, 2000);

  })
}

function restoreOptions() {
  var searchScope   = document.getElementById("search-scope"),
      closeNew      = document.getElementById("close-new"),
      closeExisting = document.getElementById("close-existing"), 
      whitelist     = document.getElementById("whitelist");

  chrome.storage.sync.get({
    searchScope: 'active',
    closeNew: 'true',
    closeExisting: 'false',
    whitelist: ''
  }, function(items) {
    searchScope.value = items.searchScope;
    closeNew.checked = items.closeNew;
    closeExisting.checked = items.closeExisting;
    whitelist.value = items.whitelist;
  })
}
