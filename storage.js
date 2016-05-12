// Prepare class
var Storage = {
    getItem: function(name) {
        return localStorage.getItem(name);
    },
    setItem: function(name, value) {
        localStorage.setItem(name, value);
    },
    removeItem: function(name) {
        localStorage.removeItem(name);
    },
    clear: function(name) {
        localStorage.clear();
    }
};

module.exports = Storage;