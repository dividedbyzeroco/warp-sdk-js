// Prepare class
var Storage = {
    extend: function(options) {
        return {
            _url: options.baseURL,
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
    }
};

module.exports = Storage;