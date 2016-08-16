// References
var Promise = require('promise');
var _ = require('underscore');
var WarpError = require('./error');

// Class constructor
var WarpFile = function(name, data) {
    this._name = name;
    this._data = data;
};

// Instance methods
_.extend(WarpFile.prototype, {
    _url: null,
    _isNew: true,
    fileKey: null,
    getName: function() {
        return this._name;
    },
    getUrl: function() {
        if(!this._url) throw new WarpError(WarpError.Code.InvalidObjectKey, 'URL not found');
        return this._url;
    },
    save: function() {
        if(!WarpFunction._http) throw new WarpError(WarpError.Code.MissingConfiguration, 'Missing HTTP for Function');
        
        var args = new FormData();
        args.append('name', this._name);
        args.append('file', this._data, this._name);

        // Create request
        var request = WarpFile._http.upload(name, args).then(function(response) {
            if(!response.result) throw new WarpError(WarpError.Code.InvalidObjectKey, 'File not saved');
            this._url = response.result.url;
            this.fileKey = response.result.key;
            return this;
        }.bind(this));

        // Check args
        if(typeof next === 'function')
            request = request.then(next);
        if(typeof fail === 'function')
            request = request.catch(fail);
        return request;
    }
});

// Static methods
_.extend(WarpFile, {
    _http: null,
    initialize: function(http) {
        this._http = http;
    }
});

module.exports = WarpFile;