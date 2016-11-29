// References
var Promise = require('promise');
var _ = require('underscore');
var WarpError = require('./error');

// Utils classes
var KeyMap = function(keys) {
    this._keys = keys;
    this.get = function(key) {
        return this._keys[key];
    };
    this.each = function(iterator) {
        for(var key in this._keys)
            iterator(this._keys[key]);
    };
    this.copy = function() {
        return _.extend({}, this._keys);
    };
};

module.exports = {
    extend: function() {
        // Class constructor
        var Http = {
            _api: null,
            initialize: function(api) {
                if(!api) throw new WarpError(WarpError.Code.MissingConfiguration, 'API must be set');
                this._api = api;
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
                var className = endpoint.replace('classes/', '');
                var options = {
                    include: args.include || {},
                    where: args.where || {},
                    sort: args.sort || [],
                    limit: args.limit || 100,
                    skip: args.skip || 0
                };
                
                if(className === 'users')
                    return this._api._getUserModel().find(options);
                else
                    return this._api._getModel(className).find(options);
            },
            first: function(endpoint, id) {
                var className = endpoint.replace('classes/', '');

                if(className === 'users')
                    return this._api._getUserModel().first(id);
                else
                    return this._api._getModel(className).first(id);
            },
            create: function(endpoint, args) {
                var className = endpoint.replace('classes/', '');
                var fields = args;
                
                if(className === 'users')
                    return this._api._getUserModel().create({ fields: fields });
                else
                    return this._api._getModel(className).create({ fields: fields });
            },
            update: function(endpoint, id, args) {
                var className = endpoint.replace('classes/', '');
                var fields = args;
                
                if(className === 'users')
                    return this._api._getUserModel().update({ id: id, fields: fields });
                else
                    return this._api._getModel(className).update({ id: id, fields: fields });
            },
            destroy: function(endpoint, id) {
                var className = endpoint.replace('classes/', '');
                
                if(className === 'users')
                    return this._api._getUserModel().destroy({ id: id });
                else
                    return this._api._getModel(className).destroy({ id: id });
            },
            run: function(endpoint, args) {
                var funcName = endpoint.replace('functions/', '');
                
                return new Promise(function(resolve, reject) {
                    var request = {
                        keys: new KeyMap(args)
                    };
                    var response = {
                        success: function(result) {
                            resolve({ status: 200, message: 'Success', result: result });
                        },
                        error: function(message) {
                            if(typeof message == 'object' && message.getMessage) message = message.getMessage();
                            var error = new Error(message);
                            error.code = 101;
                            reject(error);
                        }
                    };

                    this._api._getFunction(funcName).run(request, response);
                }.bind(this));
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

        return Http;

    }
};