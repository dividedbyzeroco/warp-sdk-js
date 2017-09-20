// Prepare class
var Storage = {
    _url: '',
    initialize: function(url) {
        this._url = url;
    },
    getItem: function(name) {
        return localStorage.getItem(this._url + ':' + name);
    },
    setItem: function(name, value) {
        localStorage.setItem(this._url + ':' + name, value);
    },
    removeItem: function(name) {
        localStorage.removeItem(name);
    },
    clear: function(name) {
        localStorage.clear();
    }
};

module.exports = Storage;