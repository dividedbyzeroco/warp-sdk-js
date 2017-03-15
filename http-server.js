// References
var Promise = require('promise');
var _ = require('underscore');
var WarpError = require('./error');
var request = require('request');

// Class constructor
var Http = {
    _baseURL: 'api/1/',
    _apiKey: null,
    _request: function(method, url, args, isRaw) {
        // Make sure configurations are made
        if(!method || !url)
            throw new WarpError(WarpError.Code.MissingConfiguration, 'Missing url and/or HTTP method');
            
        // Prepare url and method
        url = this._baseURL.replace(/\/$/, "") + '/' + url;
        method = method.toUpperCase();
        
        // Return request
        return new Promise(function (resolve, reject) {
            // Instantiate the XMLHttpRequest
            var params = '';
                
            // Set onload method
            var onreadystatechange = function(err, res, body) {
                if(err)
                {
                    var error = new WarpError(501, err.message);
                    return reject(error);
                }
                else if(res.statusCode >= 200 && res.statusCode < 300)
                {
                    return resolve(JSON.parse(body).result);
                }
                else
                {
                    var error = new WarpError(res.statusCode, res.message);
                    return reject(error);
                }
            };
                        
            // Check method
            if(method === 'GET')
            {
                var parsed = [];
                for(var item in args)
                {                            
                    var value = args[item];
                            
                    if(typeof value === 'undefined' || typeof value === 'null')
                        continue;
                    else if(typeof value === 'object')
                        if(typeof value.map !== 'function' && Object.keys(value).length == 0)
                            continue;
                        else
                            value = JSON.stringify(value);
                    
                    parsed.push(encodeURIComponent(item) + '=' + encodeURIComponent(value));
                }
                url += '?' + parsed.join('&');
            }

            var headers = {
                'X-Warp-API-Key': this._apiKey,
                'X-Warp-Session-Token': this.getSessionToken()
            };
            
            if(!isRaw)
            {
                if(method === 'POST' || method === 'PUT')
                {
                    headers['Content-Type'] = 'application/json';
                    params = args? JSON.stringify(args) : null;
                }
                else
                    headers['Content-Type'] = 'application/x-www-form-urlencode';
            }
            else
            {
                params = args;
            }

            // Prepare options
            var options = {
                method: method,
                url: url,
                headers: headers,
                body: params
            };
            
            // Send the request
            request(options, onreadystatechange);
        }.bind(this));
    },
    initialize: function(config) {
        if(!config.apiKey) throw new WarpError(WarpError.Code.MissingConfiguration, 'API Key must be set');
        this._apiKey = config.apiKey;
        this._baseURL = config.baseURL || this._baseURL;
    },    
    setSessionToken: function(sessionToken) {
        return;
    },
    unsetSessionToken: function() {
        return;
    },
    getSessionToken: function() {
        return null;
    },
    find: function(endpoint, args) {
        return this._request('GET', endpoint, args);
    },
    first: function(endpoint, id) {
        return this._request('GET', endpoint + '/' + id);
    },
    create: function(endpoint, args) {
        return this._request('POST', endpoint, args);
    },
    update: function(endpoint, id, args) {
        return this._request('PUT', endpoint + '/' + id, args);
    },
    destroy: function(endpoint, id) {
        return this._request('DELETE', endpoint + '/' + id);
    },
    run: function(endpoint, args) {
        return this._request('POST', endpoint, args);
    },
    upload: function(args) {
        throw new WarpError(WarpError.Code.ForbiddenOperation, 'Cannot upload files using the JS SDK for Node');
    },
    logIn: function(args) {
        throw new WarpError(WarpError.Code.ForbiddenOperation, 'Cannot log in using the JS SDK for Node');
    },
    logOut: function() {
        throw new WarpError(WarpError.Code.ForbiddenOperation, 'Cannot log out using the JS SDK for Node');
    },
    current: function() {
        throw new WarpError(WarpError.Code.ForbiddenOperation, 'Cannot get current user using the JS SDK for Node');
    }
};

module.exports = Http;