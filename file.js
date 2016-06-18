// References
var Promise = require('promise');
var _ = require('underscore');

// Class constructor
var WarpFile = function() {
};

// Instance methods
_.extend(WarpFile, {
    _url: null,
    fileKey: null,
    getUrl: function() {
        return this._url;
    },
    save: function() {
        // To-Do
    }
});