// References
var _ = require('underscore');
var WarpError = require('./error');

// Class constructor
var WarpCollection = function(list) {
    this._list = list;
};

// Instance methods
_.extend(WarpCollection.prototype, {
    count: function() {
        return this._list.length;
    },
    first: function() {
        return this._list[0];
    },
    match: function(properties) {
        var list = _.filter(this._list, function(item) {
            return _.where([item._attributes], properties).length > 0;
        });
        return new WarpCollection(list);
    },
    where: function(predicate) {
        var list = _.filter(this._list, predicate);
        return new WarpCollection(list);
    },
    sortBy: function(order) {
        if(typeof order === 'string' && order !== 'id' && order !== 'createdAt' && order !== 'updatedAt')
            order = function(item) {
                return item.get(order);
            };
        var list = _.sortBy(this._list, order);
        return new WarpCollection(list);
    },
    sortByDescending: function(order) {
        if(typeof order === 'string' && order !== 'id' && order !== 'createdAt' && order !== 'updatedAt')
            order = function(item) {
                return item.get(order);
            };
        var list = _.sortBy(this._list, order);
        list.reverse();
        return new WarpCollection(list);
    },
    each: function(iteratee) {
        var promise = Promise.resolve();
        var list = _.filter(this._list, function() { return true; });
        
        // Loop through the list
        for(var item in list)
        {
            promise = promise.then(function() {
                return iteratee(list.shift());
            });
        }
        
        // Catch any possible error
        promise.catch(function(e) {
            console.log('[WarpCollection] Error in `each` function', e);
        });
        
        return promise;
    },
    map: function(iteratee) {
        return this._list.map(iteratee);
    },
    toList: function() {
        return _.filter(this._list, function(){ return true; });
    },
    toJSON: function() {
        return this._list.map(function(item) {
            return item.toJSON();
        });
    }
});

// Static methods
_.extend(WarpCollection, {
    
});

module.exports = WarpCollection;