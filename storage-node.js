// Prepare class
var Storage = {
    items: {},
    getItem: function(name) {
        return this.items[name];
    },
    setItem: function(name, value) {
        this.items[name] = value;
    },
    removeItem: function(name) {
        delete this.items[name];
    },
    clear: function(name) {
        this.items = {};
    }
};

module.exports = Storage;