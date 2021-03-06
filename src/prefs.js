(function() {

  window.retabber = window.retabber || {};

  retabber.PrefStore = function() {
    this.listeners_ = []
    this.defaults_ = {
      prefs: {
        searchScope: 'active',
        closeNew: 'true',
        closeExisting: 'false',
        whitelist: ''
      }
    };

    chrome.storage.onChanged.addListener(this.notifyListeners.bind(this));
  };

  retabber.PrefStore.prototype = {
    get_: function(key, callback) {
      chrome.storage.sync.get(this.defaults_,
        function (storage) {
          if(key == "all")
            callback(storage.prefs);
          else
            callback(storage.prefs[key]);
        }
      );
    },

    set_: function(key, value) {
      chrome.storage.sync.get(this.defaults_,
        function (storage) {
          if(key == "all") {
            storage.prefs = value;
            chrome.storage.sync.set(storage);
          } else {
            storage.prefs[key] = value;
            chrome.storage.sync.set(storage);
          }
        }
      );
    },

    addListener: function(callback) {
      if(isFunction(callback)) {
        this.listeners_.push(callback);
      }
    },

    notifyListeners: function(changes, namespace) {
      for(var i = 0; i < this.listeners_.length; i++) {
        this.listeners_[i](changes.prefs.newValue);
      }
    },

    getAll: function(callback) {
      this.get_("all", callback);
    },

    setAll: function(items) {
      this.set_("all", items);
    },

    getSearchScope: function(callback) {
      this.get_("searchScope", callback);
    },

    setSearchScope: function(searchScope) {
      this.set_("searchSscope", searchScope);
    },

    getCloseNew: function(callback) {
      this.get_("closeNew", callback);
    },

    setCloseNew: function(closeNew) {
      this.set_("closeNew", closeNew);
    },

    getCloseExisting: function(callback) {
      this.get_("closeExisting", callback);
    },

    setCloseExisting: function(closeExisting) {
      this.set_("closeExisting", closeExisting);
    },

    getWhiteList: function(callback) {
      this.get_("whitelist", callback);
    },

    setWhiteList: function(whitelist) {
      this.set_("whitelist", whitelist);
    }
  };

})();
