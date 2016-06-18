// References
var Promise = require('promise');
var _ = require('underscore');

// Class constructor
var WarpObject = function(className, attributes) {
    this.id = null;
    this.createdAt = null;
    this.updatedAt = null;
    this.className = className;
    this._isNew = true;
    this._isDirty = false;
    this._attributes = {};
    this.set(attributes);
    this.initialize.apply(this, arguments);
};

// Instance methods
_.extend(WarpObject.prototype, {    
    _getEndpoint: function(className) {
        return 'classes/' + className;
    },
    _set: function(attr, value) {
        if(typeof attr !== 'undefined' && value == null)
            this._attributes[attr] = null;
        else if(typeof value === 'object')
            if(value.className)
                if(!value._isNew)
                    this._attributes[attr] = value;
                else
                    throw new WarpError(WarpError.Code.ForbiddenOperation, 'Cannot set a new Pointer as a key, please save the Pointer before using it');
            else if(value.fileKey)
                if(!value._isNew)
                    this._attributes[attr] = value;
                else
                    throw new WarpError(WarpError.Code.ForbiddenOperation, 'Cannot set a new File as a key, please save the File before using it');
            else if(value.type === 'Pointer' || value.type === 'File')
                this._attributes[attr] = value;
        else if(typeof attr !== 'undefined' && typeof value !== 'undefined')
            if(attr != 'id' && attr != 'created_at' && attr != 'updated_at')
                this._attributes[attr] = value;
    },
    initialize: function() {
        // Empty function; Override with User-defined version
    },
    set: function(attr, value) {
        var oldAttr = _.extend({}, this._attributes);
        if(typeof attr === 'object')
            for(var key in attr)
                this._set(key, attr[key]);
        else
            this._set(attr, value);
        if(!_.isEqual(oldAttr, this._attributes)) this._isDirty = true;
        return this;
    },
    get: function(attr) {
        return this._attributes[attr];
    },
    save: function(next, fail) {
        // Check configurations
        if(!WarpObject._http) throw new WarpError(WarpError.Code.MissingConfiguration, 'Missing HTTP for Query');
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
        
        // Set the `isDirty` toggle to false
        this._isDirty = false;
        
        // Prepare params and request
        var params = this._attributes;
        var request = null;
        
        // Modify `pointer` and `file` params
        for(var index in params)
        {
            var param = params[index];
            if(typeof param === 'object')
                if(param.className)
                    params[index] = { type: 'Pointer', className: param.className, id: param.id };
                else if(param.fileKey)
                    params[index] = { type: 'File', key: param.fileKey };
        }
        
        if(this._isNew)
            request = WarpObject._http.create(this._getEndpoint(this.className), params).then(function(result) {
                this.id = result.id;
                this.createdAt = result.created_at;
                this.updatedAt = result.updated_at;
                this._isNew = false;
                return this;
            }.bind(this));
        else
            request = WarpObject._http.update(this._getEndpoint(this.className), this.id, params).then(function(result) {
                Object.keys(result).forEach(function(key) {
                    if(key !== 'id' && key !== 'created_at' && key !== 'updated_at')
                        this.set(key, result[key]);
                }.bind(this));
                this.updatedAt = result.updated_at;
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
        
        var request = WarpObject._http.destroy(this._getEndpoint(this.className), this.id).then(function() {
            this._attributes = {};
            this.id = null;
            this.createdAt = null;
            this.updatedAt = null;
            this._isDirty = false;
            return this;
        }.bind(this));
        
        if(typeof next === 'function')
            request.then(next);
        if(typeof fail === 'function')
            request.catch(fail);            
        return request;                
    }
});

// Static methods
_.extend(WarpObject, {
    _http: null,
    _subclasses: {},
    initialize: function(http) {
        this._http = http;
    },
    createWithoutData: function(id) {        
        var instance = new this();
        instance.id = id;
        return instance;
    },
    registerSubclass: function(subclass) {
        this._subclasses[subclass.className] = subclass;
    },
    getSubclass: function(className) {
        var subclass = this._subclasses[className] 
        return subclass ? subclass : this;
    },
    extend: function(className, instanceProps, classProps) {
        var parentProto = WarpObject.prototype;        
        var self = this;
        
        if(this.hasOwnProperty('__super__') && this.__super__)
            parentProto = this.prototype;
            
        var WarpObjectSubclass = function(attributes)
        {
            self.apply(this, [className, attributes]);
            this.className = className;
            this.set(attributes || {});
            
            if(typeof this.initialize === 'function')
                this.initialize.apply(this, arguments);
        }
        WarpObjectSubclass.className = className;
        WarpObjectSubclass.__super__ = parentProto;
        
        // Use underscore create for compatibility; In the future, use Object.create
        WarpObjectSubclass.prototype = _.create(parentProto, {
            constructor: WarpObjectSubclass
        });
        
        // Use underscore extend for compatibility; In the future, use Object.defineProperty
        _.extend(WarpObjectSubclass.prototype, instanceProps);
        _.extend(WarpObjectSubclass, classProps);
                
        WarpObjectSubclass.extend = function(name, instanceProps, classProps) {
            return WarpObject.extend.call(WarpObjectSubclass, name, instanceProps, classProps);
        };
        WarpObjectSubclass.createWithoutData = WarpObject.createWithoutData;
                
        return WarpObjectSubclass;
    }
});

module.exports = WarpObject;