// References
var Promise = require('promise');
var _ = require('underscore');
var WarpError = require('./error');

module.exports = {
    extend: function() {
        // Class constructor
        var WarpFunction = {};

        // Static methods
        _.extend(WarpFunction, {
            _http: null,
            initialize: function(http) {
                this._http = http;
            },
            run: function(name, args, next, fail) {
                if(!WarpFunction._http) throw new WarpError(WarpError.Code.MissingConfiguration, 'Missing HTTP for Function');
                
                // Create request
                var request = WarpFunction._http.run('functions/' + name, args).then(function(response) {
                    return response;
                });

                // Check args
                if(typeof next === 'function')
                    request = request.then(next);
                if(typeof fail === 'function')
                    request = request.catch(fail);
                return request;
            }
        });

        return WarpFunction;
    }
};