// References
var _ = require('underscore');
var WarpError = require('./error');
var WarpCollection = require('./collection');

module.exports = {
    extend: function() {
        // Class constructor
        var WarpQuery = function(className) {
            this.className = (typeof className === 'function') ? className.className : className;
            this._subclass = (typeof className === 'function') ? className : WarpQuery._object.getSubclass(className);
            this._include = [];
            this._where = {};
            this._sort = [];
            this._limit;
            this._skip;
        };

        // Instance methods
        _.extend(WarpQuery.prototype, {
            _addWhere: function(type, key, value) {
                var keyConstraints = this._where[key] || {};
                keyConstraints[type] = value;
                this._where[key] = keyConstraints;
                return this;
            },
            _addSort: function(key, direction) {
                var order = {};
                order[key] = direction || 1;
                this._sort.push(order);
                return this;
            },
            initialize: function(http) {
                this._http = http;
            },
            include: function(key) {
                this._include.push(key);
                return this;
            },
            equalTo: function(key, value) {
                return this._addWhere('eq', key, value);
            },
            notEqualTo: function(key, value) {
                return this._addWhere('neq', key, value);
            },
            greaterThan: function(key, value) {
                return this._addWhere('gt', key, value);
            },
            greaterThanOrEqualTo: function(key, value) {
                return this._addWhere('gte', key, value);
            },
            lessThan: function(key, value) {
                return this._addWhere('lt', key, value);
            },
            lessThanOrEqualTo: function(key, value) {
                return this._addWhere('lte', key, value);
            },
            exists: function(key) {
                return this._addWhere('ex', key, true);
            },
            doesNotExist: function(key) {
                return this._addWhere('ex', key, false);
            },
            containedIn: function(key, value) {
                return this._addWhere('in', key, value);
            },
            containedInOrDoesNotExist: function(key, value) {
                return this._addWhere('inx', key, value);
            },
            notContainedIn: function(key, value) {
                return this._addWhere('nin', key, value);
            },
            startsWith: function(key, value) {
                return this._addWhere('str', key, value);
            },
            endsWith: function(key, value) {
                return this._addWhere('end', key, value);
            },
            contains: function(key, value) {
                if(typeof key === 'object' && key.join !== null)
                    key = key.join('|');
                return this._addWhere('has', key, value);
            },
            foundIn: function(key, value, query) {
                var subQuery = {
                    className: query.className,
                    select: value,
                    where: query._where,
                    limit: query._limit,
                    skip: query._skip
                };
                return this._addWhere('fi', key, subQuery);
            },
            foundInEither: function(key, queryList) {
                var subQueries = [];
                for(var index in queryList)
                {
                    var value = Object.keys(queryList[index])[0];
                    var query = queryList[index][value];
                    subQueries.push({
                        className: query.className,
                        select: value,
                        where: query._where,
                        limit: query._limit,
                        skip: query._skip
                    });
                }
                return this._addWhere('fie', key, subQueries);
            },
            notFoundIn: function(key, value, query) {
                var subQuery = {
                    className: query.className,
                    select: value,
                    where: query._where,
                    limit: query._limit,
                    skip: query._skip
                };
                return this._addWhere('nfi', key, subQuery);
            },
            sortBy: function(key) {
                if(typeof key === 'object')
                {
                    key.forEach(function(k) {
                        this._addSort(k);
                    }.bind(this));
                    return this;
                }
                else
                    return this._addSort(key);
            },
            sortByDescending: function(key) {
                if(typeof key === 'object')
                {
                    key.forEach(function(k) {
                        this._addSort(k, -1);
                    }.bind(this));
                    return this;
                }
                else
                    return this._addSort(key, -1);
            },
            limit: function(limit) {
                this._limit = limit;
                return this;
            },
            skip: function(skip) {
                this._skip = skip;
                return this;
            },
            find: function(next, fail) {
                var params = {
                    include: this._include,
                    where: this._where,
                    sort: this._sort,
                    limit: this._limit,
                    skip: this._skip
                };
                
                if(!WarpQuery._http) throw new WarpError(WarpError.Code.MissingConfiguration, 'Missing HTTP for Query');
                var classRoute = this.className === 'user' ? 'users' : 'classes/' + this.className;
                var request = WarpQuery._http.find(classRoute, params).then(function(result) {
                    var list = result.map(function(item) {
                        var object = new this._subclass();

                        // Set default className
                        if(typeof object.className === 'undefined')
                            object.className = this.className;
                        
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
                                    var pointerSubclass = WarpQuery._object.getSubclass(value.className);
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
                        object.id = item.id;
                        object.createdAt = item.created_at;
                        object.updatedAt = item.updated_at;
                        object._isNew = false;
                        object._isDirty = false;
                        
                        return object;
                    }.bind(this));
                    return new WarpCollection(list);
                }.bind(this));
                
                if(typeof next === 'function')
                    request = request.then(next);
                if(typeof fail === 'function')
                    request = request.catch(fail);
                return request;
            },
            first: function(next, fail) {
                this._limit = 1;
                this._skip = 0;
                var query = this.find(function(result) {
                    return result.first();
                });
                if(typeof next === 'function')
                    query = query.then(next);
                if(typeof fail === 'function')
                    query = query.catch(fail);
                    
                return query;
            },
            get: function(id, next, fail) {
                this.equalTo('id', id);
                var query = this.first();        
                if(typeof next === 'function')
                    query = query.then(next);
                if(typeof fail === 'function')
                    query = query.catch(fail);
                    
                return query;
            }
        });

        _.extend(WarpQuery, {
            _http: null,
            initialize: function(http, object, file) {
                this._http = http;
                this._object = object;
                this._file = file;
            }
        });

        return WarpQuery;
    }
};