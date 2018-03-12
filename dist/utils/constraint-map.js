'use strict';Object.defineProperty(exports, "__esModule", { value: true });exports.Subqueries = exports.Constraints = undefined;var _extends = Object.assign || function (target) {for (var i = 1; i < arguments.length; i++) {var source = arguments[i];for (var key in source) {if (Object.prototype.hasOwnProperty.call(source, key)) {target[key] = source[key];}}}return target;};var _createClass = function () {function defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}return function (Constructor, protoProps, staticProps) {if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;};}();
/** 
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              * References
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             */
var _error = require('./error');var _error2 = _interopRequireDefault(_error);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}var

KeyConstraints = function () {







    /**
                               * Constructor
                               * @param {String} key
                               * @param {Object} list
                               * @param {String} key
                               */ /**
                                   * Private properties
                                   */function KeyConstraints(key, map) {_classCallCheck(this, KeyConstraints); // Set values
        this._key = key;
        this._map = map;
    }_createClass(KeyConstraints, [{ key: 'set', value: function set(











        constraint, value) {
            this._map[constraint] = value;
        } }, { key: 'changeKey', value: function changeKey(

        newKey) {
            this._key = newKey;
        } }, { key: 'constraintExists', value: function constraintExists(

        constraint) {
            return typeof this._map[constraint] !== 'undefined';
        } }, { key: 'toJSON', value: function toJSON()

        {
            return Object.freeze(_extends({}, this._map));
        } }, { key: 'key', get: function get() {return this._key;} }, { key: 'list', get: function get() {var _this = this;return Object.keys(this._map).map(function (constraint) {return { key: _this.key, constraint: constraint, value: _this._map[constraint] };});} }]);return KeyConstraints;}();


var Constraints = exports.Constraints = Object.freeze({
    EqualTo: 'eq',
    NotEqualTo: 'neq',
    GreaterThan: 'gt',
    GreaterThanOrEqualTo: 'gte',
    LessThan: 'lt',
    LessThanOrEqualTo: 'lte',
    Exists: 'ex',
    ContainedIn: 'in',
    NotContainedIn: 'nin',
    ContainedInOrDoesNotExist: 'inx',
    StartsWith: 'str',
    EndsWith: 'end',
    Contains: 'has',
    ContainsEither: 'hasi',
    ContainsAll: 'hasa',
    FoundIn: 'fi',
    FoundInEither: 'fie',
    FoundInAll: 'fia',
    NotFoundIn: 'nfi',
    NotFoundInEither: 'nfe' });


var Subqueries = exports.Subqueries = Object.freeze({
    FoundIn: 'fi',
    FoundInEither: 'fie',
    FoundInAll: 'fia',
    NotFoundIn: 'nfi',
    NotFoundInEither: 'nfe' });var


ConstraintMap = function () {_createClass(ConstraintMap, null, [{ key: 'Constraints', get: function get()






        {
            return Constraints;
        } /**
           * Private properties
           */ }, { key: 'Subqueries', get: function get() {
            return Subqueries;
        }

        /**
           * Constructor
           * @param {Object} keyValuePairs
           */ }]);
    function ConstraintMap() {var constraints = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};_classCallCheck(this, ConstraintMap);this._map = {};
        // Populate map
        for (var _key in constraints) {
            this._map[_key] = new KeyConstraints(_key, constraints[_key]);
        }
    }_createClass(ConstraintMap, [{ key: 'set', value: function set(

        key, constraint, value) {
            var constraints = this._map[key] || new KeyConstraints(key, {});
            constraints.set(constraint, value);
            this._map[key] = constraints;
        } }, { key: 'changeKey', value: function changeKey(

        key, newKey) {
            var constraints = this._map[key];
            if (!constraints)
            throw new _error2.default(_error2.default.Code.MissingConfiguration, 'Constraint key being changed does not exist: `' + key + '`');

            constraints.changeKey(newKey);
            this._map[newKey] = constraints;
            delete this._map[key];
        } }, { key: 'get', value: function get(

        key) {
            return this._map[key];
        } }, { key: 'getKeys', value: function getKeys()

        {
            return Object.keys(this._map);
        } }, { key: 'getConstraints', value: function getConstraints(

        key) {
            // Get the value for the keyValuePair
            return this._map[key].list;
        } }, { key: 'equalTo', value: function equalTo(

        key, value) {
            this.set(key, Constraints.EqualTo, value);
        } }, { key: 'notEqualTo', value: function notEqualTo(

        key, value) {
            this.set(key, Constraints.NotEqualTo, value);
        } }, { key: 'greaterThan', value: function greaterThan(

        key, value) {
            this.set(key, Constraints.GreaterThan, value);
        } }, { key: 'greaterThanOrEqualTo', value: function greaterThanOrEqualTo(

        key, value) {
            this.set(key, Constraints.GreaterThanOrEqualTo, value);
        } }, { key: 'lessThan', value: function lessThan(

        key, value) {
            this.set(key, Constraints.LessThan, value);
        } }, { key: 'lessThanOrEqualTo', value: function lessThanOrEqualTo(

        key, value) {
            this.set(key, Constraints.LessThanOrEqualTo, value);
        } }, { key: 'exists', value: function exists(

        key) {
            this.set(key, Constraints.Exists, true);
        } }, { key: 'doesNotExist', value: function doesNotExist(

        key) {
            this.set(key, Constraints.Exists, false);
        } }, { key: 'containedIn', value: function containedIn(

        key, value) {
            this.set(key, Constraints.ContainedIn, value);
        } }, { key: 'notContainedIn', value: function notContainedIn(

        key, value) {
            this.set(key, Constraints.NotContainedIn, value);
        } }, { key: 'containedInOrDoesNotExist', value: function containedInOrDoesNotExist(

        key, value) {
            this.set(key, Constraints.ContainedInOrDoesNotExist, value);
        } }, { key: 'startsWith', value: function startsWith(

        key, value) {
            this.set(key, Constraints.StartsWith, value);
        } }, { key: 'endsWith', value: function endsWith(

        key, value) {
            this.set(key, Constraints.EndsWith, value);
        } }, { key: 'contains', value: function contains(

        key, value) {
            this.set(key, Constraints.Contains, value);
        } }, { key: 'containsEither', value: function containsEither(

        key, value) {
            this.set(key, Constraints.ContainsEither, value);
        } }, { key: 'containsAll', value: function containsAll(

        key, value) {
            this.set(key, Constraints.ContainsAll, value);
        } }, { key: 'foundIn', value: function foundIn(

        key, value) {
            this.set(key, Constraints.FoundIn, value);
        } }, { key: 'foundInEither', value: function foundInEither(

        key, value) {
            this.set(key, Constraints.FoundInEither, value);
        } }, { key: 'foundInAll', value: function foundInAll(

        key, value) {
            this.set(key, Constraints.FoundInAll, value);
        } }, { key: 'notFoundIn', value: function notFoundIn(

        key, value) {
            this.set(key, Constraints.NotFoundIn, value);
        } }, { key: 'notFoundInEither', value: function notFoundInEither(

        key, value) {
            this.set(key, Constraints.NotFoundInEither, value);
        } }, { key: 'toList', value: function toList()

        {var _this2 = this;
            return Object.keys(this._map).map(function (key) {return _this2._map[key];});
        } }, { key: 'toJSON', value: function toJSON()

        {var _this3 = this;
            return Object.keys(this._map).reduce(function (map, key) {
                map[key] = _this3._map[key].toJSON();
                return map;
            }, {});
        } }]);return ConstraintMap;}();exports.default = ConstraintMap;