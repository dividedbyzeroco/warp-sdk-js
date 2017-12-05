// References
var Promise = require('promise');
var _ = require('underscore');
var WarpError = require('./error');
var moment = require('moment-timezone');

module.exports = {
    extend: function() {
        // Class constructor
        var WarpObject = function(className, attributes) {
            this.id = null;
            this.createdAt = null;
            this.updatedAt = null;
            this.className = className;
            this._isNew = true;
            this._isDirty = false;
            this._attributes = {};
            this._increments = {};
            this._jsonAppends = {};
            this._jsonSets = {};
            if(attributes) this.set(attributes);
            this.initialize();
        };
        
        function getJsonParts(key) {
            var firstPoint = key.indexOf('.');
            var firstBracket = key.indexOf('[');

            if(firstPoint < 0 && firstBracket < 0)
                return { key: key, path: '$' };
            else if(firstBracket < 0 || firstPoint < firstBracket)
                return {
                    key: key.substring(0, firstPoint),
                    path: '$' + key.substr(firstPoint)
                };
            else
                return {
                    key: key.substring(0, firstBracket),
                    path: '$' + key.substr(firstBracket)
                };
        }

        // Instance methods
        _.extend(WarpObject.prototype, {    
            _getEndpoint: function(className) {
                return 'classes/' + className;
            },
            _set: function(attr, value) {
                if(typeof attr !== 'undefined' && typeof value === 'null')
                    this._attributes[attr] = null;
                else if(value && typeof value === 'object')
                {
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
                    else if(value.type === 'Increment')
                        throw new WarpError(WarpError.Code.ForbiddenOperation, 'Cannot directly set an increment object, please use the `increment` function instead');
                    else if(value instanceof Date)
                        this._attributes[attr] = moment(value).format();
                    else
                        this._attributes[attr] = value;
                }
                else if(typeof attr !== 'undefined' && typeof value !== 'undefined')
                    if(attr != 'className' && attr != 'id' && attr != 'created_at' && attr != 'updated_at')
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
                //if(!_.isEqual(oldAttr, this._attributes)) this._isDirty = true;
                this._isDirty = true;
                return this;
            },
            get: function(attr) {
                return this._attributes[attr];
            },
            increment: function(attr, value) {
                if(value === null) this._increments[attr] = 0;
                if(isNaN(value) || parseInt(value) != value) throw new WarpError(WarpError.Code.InvalidObjectKey, 'The increment value must be an integer');
                this._increments[attr] = parseInt(value);
                this._isDirty = true;
                return this;
            },
            jsonAppend: function(attr, value) {
                var jsonParts = getJsonParts(attr);
                this._jsonAppends[jsonParts.key] = { path: jsonParts.path, value: value };
                this._isDirty = true;
                return this;
            },
            jsonSet: function(attr, value) {
                var jsonParts = getJsonParts(attr);
                this._jsonSets[jsonParts.key] = { path: jsonParts.path, value: value };
                this._isDirty = true;
                return this;
            },
            fetch: function(next, fail) {
                if(!WarpObject._http) throw new WarpError(WarpError.Code.MissingConfiguration, 'Missing HTTP for Query');
                var classRoute = this.className === 'user' ? 'users' : 'classes/' + this.className;
                var request = WarpObject._http.first(classRoute, this.id).then(function(item) {
                    var object = this;

                    for(var key in item)
                    {
                        // Get value
                        var value = item[key];
                        
                        // Check if value is an object
                        if(value && typeof value === 'object')
                        {
                            // If value is a `pointer`
                            if(value.type === 'Pointer')
                            {
                                // Create pointer
                                var pointerSubclass = WarpObject.getSubclass(value.className);
                                var pointer = new pointerSubclass();
                                
                                // Set default className
                                if(typeof pointer.className === 'undefined')
                                    pointer.className = value.className;
                                
                                // Iterate through each attribute, if they exist
                                if(value.attributes)
                                    for(var attr in value.attributes)
                                    {
                                        // Set the pointer attr value
                                        pointer.set(attr, value.attributes[attr]);
                                        // Added timestamps for the pointer, if requested
                                        if(attr === 'created_at')
                                            pointer.createdAt = value.attributes[attr];
                                        if(attr === 'updated_at')
                                            pointer.updatedAt = value.attributes[attr];
                                    }
                                    
                                // Set the pointer id
                                pointer.id = value.id;
                                pointer._isNew = false;
                                pointer._isDirty = false;
                                value = pointer;
                            }
                            
                            // If value is a `File`
                            if(value.type === 'File')
                            {
                                // Create file
                                // To-Do
                            }
                        }
                        
                        // Set the key value
                        object.set(key, value);
                    }
                    object.createdAt = item.created_at;
                    object.updatedAt = item.updated_at;
                    object._isNew = false;
                    object._isDirty = false;
                    
                    return object;
                }.bind(this));
                
                if(typeof next === 'function')
                    request = request.then(next);
                if(typeof fail === 'function')
                    request = request.catch(fail);
                return request;
            },
            save: function(next, fail) {
                // Check configurations
                if(!WarpObject._http) throw new WarpError(WarpError.Code.MissingConfiguration, 'Missing HTTP for Object');
                if(!this._isNew && !this._isDirty)
                {
                    var request = new Promise(function(resolve, reject) {
                        resolve(this);
                    }.bind(this));
                    
                    if(typeof next === 'function')
                        request = request.then(next);
                    if(typeof fail === 'function')
                        request = request.catch(fail);
                    return request;
                }
                
                // Set the `isDirty` toggle to false
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
                    delete this._attributes[key];
                }

                // Modify `jsonAppend` params
                for(var key in this._jsonAppends)
                {
                    var jsonAppend = this._jsonAppends[key];
                    params[key] = { type: 'JsonAppend', path: jsonAppend.path, value: jsonAppend.value };
                    delete this._attributes[key];
                }
            
                // Modify `jsonSet` params
                for(var key in this._jsonSets)
                {
                    var jsonSet = this._jsonSets[key];
                    params[key] = { type: 'JsonSet', path: jsonSet.path, value: jsonSet.value };
                    delete this._attributes[key];
                }

                // Reset all params
                this._increments = {};
                this._jsonAppends = {};
                this._jsonSets = {};
                
                if(this._isNew)
                    request = WarpObject._http.create(this._getEndpoint(this.className), params).then(function(result) {
                        this.id = result.id;
                        this.createdAt = moment(result.created_at).tz('UTC').format();
                        this.updatedAt = moment(result.updated_at).tz('UTC').format();
                        this._isNew = false;
                        return this;
                    }.bind(this));
                else
                    request = WarpObject._http.update(this._getEndpoint(this.className), this.id, params).then(function(result) {
                        Object.keys(result).forEach(function(key) {
                            if(key !== 'id' && key !== 'created_at' && key !== 'updated_at')
                                this.set(key, result[key]);
                        }.bind(this));
                        this.updatedAt = moment(result.updated_at).format();
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
                if(!WarpObject._http) throw new WarpError(WarpError.Code.MissingConfiguration, 'Missing HTTP for Object');
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
                        request = request.then(next);
                    if(typeof fail === 'function')
                        request = request.catch(fail);
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
                    request = request.then(next);
                if(typeof fail === 'function')
                    request = request.catch(fail);            
                return request;                
            },
            toJSON: function() {
                var item = {
                    className: this.className,
                    id: this.id,
                    created_at: this.createdAt,
                    updated_at: this.updatedAt
                };

                var attrs = this._attributes;
                
                for(var key in attrs)
                {
                    var attr = attrs[key];
                    
                    // Check if attr is an object
                    if(attr && typeof attr === 'object')
                        if(attr.className)
                        {
                            var pointer = attr;
                            if(typeof attr.toJSON === 'function') pointer = attr.toJSON();
                            attr = {
                                type: 'Pointer',
                                className: pointer.className,
                                id: pointer.id
                            };
                            //delete pointer.type;
                            delete pointer.className;
                            delete pointer.id;
                            if(Object.keys(pointer).length > 0) attr.attributes = pointer;
                        }
                        else if(attr.fileKey)
                            attr = { type: 'File', key: attr.fileKey };

                    // Set item attribute
                    item[key] = attr;
                }

                return item;
            }
        });

        // Static methods
        _.extend(WarpObject, {
            _http: null,
            _subclasses: {},
            initialize: function(http) {
                this._http = http;
            },
            createWithoutData: function(id, className) {        
                var instance = new this();
                instance.id = id;
                instance._isNew = false;
                if(className) instance.className = className;
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
    
        return WarpObject;
    }
};