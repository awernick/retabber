(function() {

  window.retabber = window.retabber || {};

  buildbot.PrefStore = function() {
    this.defaults_ = {
      prefs: {
        searchScope: 'active',
        closeNew: 'true',
        closeExisting: 'false',
        whitelist: ''
      }
    };
  };

  retabber.PrefStore.prototype = {
    get_: function(key, callback) {
      chrome.storage.sync.get(this.defaults_,
        function (storage) {
          if(key == "all")
            callback(storage);
          else
            callback(storage.prefs[key]);
        }
      );
    },

    set_: function(key, value) {
      chrome.storage.sync.get(this.defaults_,
          function (storage) {
            storage.prefs[key] = value;
            chrome.storage.sync.set(storage);
          });
    },

    getAll: function(callback) {
      this.get_("all", callback);
    }

    getSearchScope: function(callback) {
      this.get_("search_scope", callback);
    },

    setSearchScope: function(searchScope) {
      this.set_("search_scope", searchScope);
    },

    getCloseNew: function(callback) {
      this.get_("close_new", callback);
    },

    setCloseNew: function(closeNew) {
      this.set_("close_new", closeNew);
    },

    getCloseExisting: function(callback) {
      this.get_("close_existing", callback);
    },

    setCloseExisting: function(closeExisting) {
      this.set_("close_existing", closeExisting);
    },

    getWhiteList: function(callback) {
      this.get_("whitelist", callback);
    },

    setWhiteList: function(whitelist) {
      this.set_("whitelist", whitelist);
    }
  };

})();
