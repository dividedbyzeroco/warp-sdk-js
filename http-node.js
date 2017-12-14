// References
var Promise = require('promise');
var _ = require('underscore');
var moment = require('moment-timezone');
var WarpError = require('./error');
var WarpSecurity = require('./security');
var Storage = require('./storage-node');

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
            _storage: null,
            initialize: function(api) {
                if(!api) throw new WarpError(WarpError.Code.MissingConfiguration, 'API must be set');
                this._api = api;
                this._storage = Storage.extend();
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
                var username = args.username;
                var email = args.email;
                var password = args.password.toString();
                var origin = 'Warp-SDK-JS';
                
                var query = new this._api.Query.View(this._api._getUserModel().className);
                
                query.select({
                    'id': 'id', 
                    'password': 'password'
                });
        
                if(username)
                {
                    query.where({
                        'username': { 'eq' : username }
                    });
                }
                else
                {
                    query.where({
                        'email': { 'eq': email }
                    });
                }
        
                return query.first(function(user) 
                {
                    if(user && WarpSecurity.validate(password, user.password))
                    {
                        var fields = {
                            'user': {
                                type: 'Pointer',
                                className: this._api._getUserModel().className,
                                id: user.id
                            },
                            'origin': origin
                        };
                        
                        return this._api._getSessionModel().create({ fields: fields });
                    }
                    else
                    {
                        throw new WarpError(WarpError.Code.InvalidCredentials, 'Invalid username/password');
                    }
                }.bind(this))
                .then(function(result) {
                    return this._api._getSessionModel().first(result.id);
                }.bind(this));
            },
            logOut: function() {
                var sessionToken = this.getSessionToken();
                var query = new this._api.Query.View(this._api._getSessionModel().className);
                
                return query.where({ 'session_token': { 'eq' : sessionToken }, 'revoked_at': { 'gt': moment().tz('UTC').format('YYYY-MM-DD HH:mm:ss') } })
                .first(function(session) 
                {
                    if(!session)
                    {
                        throw new WarpError(WarpError.Code.InvalidSessionToken, 'Session does not exist');
                    }
                    
                    var action = new this._api.Query.Action(this._api._getSessionModel().className, session.id);
                    
                    return action.fields({ 'revoked_at': moment().tz('UTC').format('YYYY-MM-DD HH:mm:ss') }).update();
                }.bind(this));
            },
            current: function() {
                var sessionToken = this.getSessionToken();
                var query = new this._api.Query.View(this._api._getSessionModel().className);
                
                return query.where({ 'session_token': { 'eq' : sessionToken }, 'revoked_at': { 'gt': moment().tz('UTC').format('YYYY-MM-DD HH:mm:ss') } })
                .first(function(result) 
                {
                    if(!result)
                        throw new WarpError(WarpError.Code.InvalidSessionToken, 'Session does not exist');
                    
                    var first = this._api._getUserModel().first(result.user_id, include);
                    return first;
                }.bind(this));
            }
        };

        return Http;
    }
};