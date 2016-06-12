// References
var Promise = require('promise');
var _ = require('underscore');
var WarpError = require('./error');
var Stroage = require('./storage-node');

// Class constructor
var Http = {
    _api: null,
    _storage: Storage,
    initialize: function(api) {
        if(!api) throw new WarpError(WarpError.Code.MissingConfiguration, 'API must be set');
        this._api = api;
        this._baseURL = config.baseURL || this._baseURL;
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
            select: args.select || {},
            where: args.where || {},
            sort: args.order || [],
            limit: args.limit || 100,
            skip: args.skip || 0
        };
        
        return this._api._getModel(className).find(options);
    },
    first: function(endpoint, id) {
        var className = endpoint.replace('classes/', '');
        return this._api.getModel(className).first(id);
    },
    create: function(endpoint, args) {
        var className = endpoint.replace('classes/', '');
        var fields = args;
        return this._api.getModel(className).create({ fields: fields });
    },
    update: function(endpoint, id, args) {
        var className = endpoint.replace('classes/', '');
        var fields = args;
        return this._api.getModel(className).update({ id: id, fields: fields });
    },
    destroy: function(endpoint, id) {
        var className = endpoint.replace('classes/', '');
        return this._api.getModel(className).destroy({ id: id });
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