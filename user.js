// References
var _ = require('underscore');
var WarpObject = require('./object');
var WarpError = require('./error');
var Storage = require('./storage');

// Prepare class
var WarpUser = WarpObject.extend('user', {        
   _getEndpoint: function() {
       return 'users';
   },
   setUsername: function(value) {
       return this.set('username', value);
   },
   getUsername: function() {
       return this.get('username');
   },
   setEmail: function(value) {
       return this.set('email', value);
   },
   getEmail: function() {
       return this.get('email');
   },
   setPassword: function(value) {
       return this.set('password', value);
   },
   signUp: function(next, fail) {
        // Check configurations
        if(!WarpObject._http) throw new WarpError(WarpError.Code.MissingConfiguration, 'Missing HTTP for Query');
        
        // Prepare params and request
        var request = WarpObject._http.create(this._getEndpoint(), this._attributes)
        .then(function(result) {
            var username = this._attributes.username;
            var password = this._attributes.password;
            this.set('password', undefined);
            return WarpUser.logIn(username, password, next, fail);
        }.bind(this));
        
        return request;
    },
    save: function(next, fail) {
        // Check configurations
        if(!WarpObject._http) throw new WarpError(WarpError.Code.MissingConfiguration, 'Missing HTTP for Query');
        if(this._isNew) throw new WarpError(WarpError.Code.ForbiddenOperation, 'Users can only be created using `signUp`');
        if(WarpUser._persistentSessions && WarpUser.current() && WarpUser.current().id != this.id) 
            throw new WarpError(WarpError.Code.ForbiddenOperation, 'Users can only edit their own data');
        else if(WarpUser._persistentSessions && !WarpUser.current()) 
            throw new WarpError(WarpError.Code.ForbiddenOperation, 'Users can only edit their own data');
        
        if(!this._isDirty)
        {
            var request = new Promise(function(resolve, reject) {
                resolve(this);
            }.bind(this));
            
            if(typeof next === 'function')
                request.then(next);
            if(typeof fail === 'function')
                request.catch(fail);
            return request;
        }
        this._isDirty = false;
        
        // Prepare params and request
        var params = _.extend({}, this._attributes);
        var request = null;
        
        // Modify `pointer` and `file` params
        for(var key in params)
        {
            var param = params[key];
            if(param && typeof param === 'object')
                if(param.className)
                    params[key] = { type: 'Pointer', className: param.className, id: param.id };
                else if(param.fileKey)
                    params[key] = { type: 'File', key: param.fileKey };
        }

        // Modify `increment` params
        for(var key in this._increments)
        {
            var increment = this._increments[key];
            params[key] = { type: 'Increment', value: increment };
        }
        
        var request = WarpObject._http.update(this._getEndpoint(this.className), this.id, params).then(function(result) {
                Object.keys(result).forEach(function(key) {
                    if(key !== 'id' && key !== 'created_at' && key !== 'updated_at')
                        this.set(key, result[key]);
                }.bind(this));
                this._isDirty = false;
                return this;
            }.bind(this));
            
        // Check args
        if(typeof next === 'function')
            request = request.then(next);
        if(typeof fail === 'function')
            request = request.catch(fail);
        return request;
    },
    destroy: function(next, fail) {
        // Check configurations
        if(!WarpObject._http) throw new WarpError(WarpError.Code.MissingConfiguration, 'Missing HTTP for Query');
        if(WarpUser.current() && WarpUser.current().id != this.id) throw new WarpError(WarpError.Code.ForbiddenOperation, 'Users can only destroy their own data');
        else if(!WarpUser.current()) throw new WarpError(WarpError.Code.ForbiddenOperation, 'Users can only destroy their own data');
        
        if(this._isNew) 
        {
            var request = new Promise(function(resolve, reject) {
                this._attributes = {};
                this.id = null;
                this.createdAt = null;
                this.updatedAt = null;
                this._isDirty = false;
                resolve(this);
            }.bind(this));
            
            if(typeof next === 'function')
                request.then(next);
            if(typeof fail === 'function')
                request.catch(fail);
            return request;
        }
        
        var request = WarpObject._http.destroy(this._getEndpoint(this.className), this.id)
        .then(function() {
            this._attributes = {};
            this.id = null;
            this.createdAt = null;
            this.updatedAt = null;
            this._isDirty = false;
            return;
        }.bind(this))
        .then(function() {
            if(WarpUser.getSessionToken())
                return WarpUser.logOut();
            return;
        });
        
        if(typeof next === 'function')
            request.then(next);
        if(typeof fail === 'function')
            request.catch(fail);            
        return request;
    }
}, {
    _storage: Storage,
    _persistentSessions: true,
    _setSessionToken: function(sessionToken) {
        if(sessionToken)
            WarpObject._http.setSessionToken(sessionToken);
        else
            WarpObject._http.unsetSessionToken();
    },
    _setCurrent: function(user) {
        // Check if user exists
        if(!user)
            return this._storage.removeItem('x-warp-user-current');
        
        // Parse user keys
        var keys = user._attributes;
        keys.id = user.id;
        keys.created_at = user.created_at;
        keys.updated_at = user.updated_at;
        var stored = JSON.stringify(keys);
        this._storage.setItem('x-warp-user-current', stored);
    },
    getSessionToken: function() {
        return WarpObject._http.getSessionToken();
    },
    current: function() {
        if(!this._persistentSessions) throw new WarpError(WarpError.Code.ForbiddenOperation, 'Cannot get current user using the JS SDK for Node');
        var stored = this._storage.getItem('x-warp-user-current');
        if(!stored) return null;
        
        var keys = JSON.parse(stored);
        var current = new this(keys);
        current.id = keys.id;
        current.createdAt = keys.created_at;
        current.updatedAt = keys.updated_at;
        current._isNew = false;
        current._isDirty = false;
        return current;
    },
    logIn: function(username, password, next, fail) {
        // Check configurations
        if(!WarpObject._http) throw new WarpError(WarpError.Code.MissingConfiguration, 'Missing HTTP for Query');
        var credentials = {
            username: username,
            password: password
        };
        
        // Prepare request chain
        var request = this.logOut().then(function() {
            return WarpObject._http.logIn(credentials);
        })
        .then(function(result) {
            this._setSessionToken(result.session_token);
            return WarpObject._http.current('users/me');
        }.bind(this))
        .then(function(result) {
            var user = new this(result);
            user.id = result.id;
            user.createdAt = result.created_at;
            user.updatedAt = result.updated_at;
            this._setCurrent(user);
            return this.current();
        }.bind(this));
        
        // Check params
        if(typeof next === 'function')
            request.then(next);
        if(typeof fail === 'function')
            request.catch(fail);
        return request;
    },
    logOut: function(next, fail) {
        // Check configurations
        if(!WarpObject._http) throw new WarpError(WarpError.Code.MissingConfiguration, 'Missing HTTP for Query');
        if(!this.getSessionToken())
            return Promise.resolve();

        // Reset current user
        this._setCurrent(null);
        
        // Prepare logout request
        var request = WarpObject._http.logOut()
        .then(function(result) {
            this._setSessionToken(null);
            return;
        }.bind(this))
        .catch(function(error) {
            // If session does not exist, reset the current token
            if(error.code === 103) this._setSessionToken(null);
            return;
        }.bind(this));
        
        if(typeof next === 'function')
            request.then(next);
        if(typeof fail === 'function')
            request.catch(fail);
        return request;
    }
});

module.exports = WarpUser;