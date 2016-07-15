// References
var Promise = require('promise');
var _ = require('underscore');
var WarpError = require('./error');
var Storage = require('./storage-node');

// Class constructor
var Http = {
    _api: null,
    _storage: Storage,
    initialize: function(api) {
        if(!api) throw new WarpError(WarpError.Code.MissingConfiguration, 'API must be set');
        this._api = api;
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
            sort: args.order || [],
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
    logIn: function(args) {
        throw new WarpError(WarpError.Code.ForbiddenOperation, 'Cannot log in using JS SDK for Node');
    },
    logOut: function() {
        throw new WarpError(WarpError.Code.ForbiddenOperation, 'Cannot log out using JS SDK for Node');
    },
    current: function() {
        throw new WarpError(WarpError.Code.ForbiddenOperation, 'Cannot get current user using JS SDK for Node');
    }
};

module.exports = Http;