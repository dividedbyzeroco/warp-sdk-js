// References
var Promise = require('promise');
var _ = require('underscore');
var WarpError = require('./error');

// Class constructor
var Http = {
    _baseURL: 'api/1/',
    _apiKey: null,
    _storage: null,
    _request: function(method, url, args) {
        // Make sure configurations are made
        if(!method || !url)
            throw new WarpError(WarpError.Code.MissingConfiguration, 'Missing HTTP methods');
            
        // Prepare url and method
        url = this._baseURL + url;
        method = method.toUpperCase();
        
        // Return request
        return new Promise(function (resolve, reject) {            
            // Instantiate the XMLHttpRequest
            var client = new XMLHttpRequest();
            var params = '';
            var handled = false;
                
            // Set onload method
            client.onreadystatechange = function() {
                // Check readyState
                if (client.readyState !== 4 || handled) return;
                handled = true;
                                
                if(this.status >= 200 && this.status < 300)
                    return resolve(JSON.parse(this.responseText).result);
                else
                {
                    var response = JSON.parse(this.responseText);
                    var error = new WarpError(response.status, response.message);
                    return reject(error);
                }
            };
                        
            // Check method
            if(method === 'GET')
            {
                var parsed = [];
                for(var item in args)
                {
                    value = typeof args[item] === 'object' ? JSON.stringify(args[item]) : args[item];
                            
                    if(!value)
                        continue;
                            
                    if(typeof value === 'object')
                        if(Object.keys(value).length == 0)
                            continue;
                    
                    parsed.push(encodeURIComponent(item) + '=' + encodeURIComponent(value));
                }
                url += '?' + parsed.join('&');
            }
            
            // Prepare client
            client.open(method, url, true);
            client.setRequestHeader('X-Warp-API-Key', this._apiKey);
            client.setRequestHeader('X-Warp-Session-Token', this.getSessionToken());
            
            if(method === 'POST' || method === 'PUT')
            {
                client.setRequestHeader('Content-Type', 'application/json');
                params = args? JSON.stringify(args) : null;
            }
            else
                client.setRequestHeader('Content-Type', 'application/x-www-form-urlencode');
            
            // Send the request
            client.send(params);
        }.bind(this));
    },
    initialize: function(config) {
        if(!config.apiKey) throw new WarpError(WarpError.Code.MissingConfiguration, 'API Key must be set');
        this._apiKey = config.apiKey;
        this._baseURL = config.baseURL || this._baseURL;
        this._storage = config.storage;
    },
    setSessionToken: function(sessionToken) {
        this._storage.setItem('x-warp-session-token', sessionToken);
    },
    unsetSessionToken: function() {
        this._storage.removeItem('x-warp-session-token');
    },
    getSessionToken: function() {
        return this._storage.getItem('x-warp-session-token');
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
    logIn: function(args) {
        return this._request('POST', 'login', args);
    },
    logOut: function() {
        return this._request('GET', 'logout');
    },
    current: function() {
        return this._request('GET', 'users/me');
    }
};

module.exports = Http;