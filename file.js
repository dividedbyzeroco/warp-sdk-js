// References
var Promise = require('promise');
var _ = require('underscore');

// Class constructor
var WarpFile = function() {
};

// Instance methods
_.extend(WarpFile, {
    _url: null,
    _isNew: true,
    fileKey: null,
    getUrl: function() {
        return this._url;
    },
    save: function() {
        // To-Do
    }
});