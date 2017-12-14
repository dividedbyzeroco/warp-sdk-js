// Prepare class
var Storage = {
    extend: function() {
        var _store = {};
        return {
            getItem: function(name) {
                return _store[name];
            },
            setItem: function(name, value) {
                _store[name] = value;
            },
            removeItem: function(name) {
                delete _store[name];
            },
            clear: function(name) {
                _store = {};
            }
        };
    }
};

module.exports = Storage;