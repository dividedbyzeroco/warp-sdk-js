'use strict';Object.defineProperty(exports, "__esModule", { value: true });exports.KeyValuePair = undefined;var _createClass = function () {function defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}return function (Constructor, protoProps, staticProps) {if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;};}();
/**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   * References
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   */
var _error = require('./error');var _error2 = _interopRequireDefault(_error);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}var

KeyValuePair = function () {








    /**
                             * Constructor
                             * @param {String} key
                             * @param {*} value
                             * @param {String} key
                             */
    function KeyValuePair(key, value) {var alias = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : key;_classCallCheck(this, KeyValuePair);
        // Set values
        this._key = key;
        this._value = value;
        this._alias = alias;
    } /**
       * Private properties
       */_createClass(KeyValuePair, [{ key: 'key', get: function get() {
            return this._key;
        } }, { key: 'value', get: function get()

        {
            return this._value;
        }, set: function set(





        value) {
            this._value = value;
        } }, { key: 'alias', get: function get() {return this._alias;}, set: function set(

        value) {
            this._alias = value;
        } }]);return KeyValuePair;}();exports.


KeyValuePair = KeyValuePair;var

KeyMap = function () {







    /**
                       * Constructor
                       * @param {Object} keyValuePairs
                       * @param {Boolean} immutable
                       */ /**
                           * Private properties
                           */function KeyMap() {var keyValuePairs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};var immutable = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;_classCallCheck(this, KeyMap);this._map = {}; // Populate map
        for (var _key in keyValuePairs) {
            var value = keyValuePairs[_key];
            var keyValuePair = new KeyValuePair(_key, value);
            this._map[_key] = keyValuePair;
        }

        // Set immutability
        this._immutable = immutable;
    }_createClass(KeyMap, [{ key: 'set', value: function set(

        key, value) {
            // Check if immutable
            if (this._immutable)
            throw new _error2.default(_error2.default.Code.ForbiddenOperation, 'Cannot set a value for an immutable KeyMap');

            // Check if key exists
            if (typeof this._map[key] === 'undefined')
            this._map[key] = new KeyValuePair(key, value);else

                // Set value for the keyValuePair
                this._map[key].value = value;
        } }, { key: 'setAlias', value: function setAlias(

        key, alias) {
            // Check if immutable
            if (this._immutable)
            throw new _error2.default(_error2.default.Code.ForbiddenOperation, 'Cannot set an alias for an immutable KeyMap');

            // Set the alias for the keyValuePair
            this._map[key].alias = alias;
        } }, { key: 'remove', value: function remove(

        key) {
            // Check if immutable
            if (this._immutable)
            throw new _error2.default(_error2.default.Code.ForbiddenOperation, 'Cannot remove from an immutable KeyMap');

            // Remove the key from the map
            delete this._map[key];
        } }, { key: 'get', value: function get(

        key) {
            // Get the value for the keyValuePair
            if (typeof this._map[key] === 'undefined')
            this._map[key] = new KeyValuePair(key, undefined);

            // Return the value
            return this._map[key].value;
        } }, { key: 'getAlias', value: function getAlias(

        key) {
            // Get the alias for the keyValuePair
            return this._map[key].alias;
        } }, { key: 'getKeys', value: function getKeys()

        {
            return Object.keys(this._map);
        } }, { key: 'has', value: function has(

        key) {
            return typeof this._map[key] !== 'undefined';
        } }, { key: 'toList', value: function toList()

        {var _this = this;
            return this.getKeys().map(function (key) {return _this._map[key];});
        } }, { key: 'getAliases', value: function getAliases()

        {
            return this.toList().map(function (keyValuePair) {return keyValuePair.alias;});
        } }, { key: 'setImmutability', value: function setImmutability(

        immutability) {
            this._immutable = immutability;
        } }, { key: 'toJSON', value: function toJSON()

        {
            var json = this.toList().reduce(function (map, keyValuePair) {
                map[keyValuePair.key] = keyValuePair.value;
                return map;
            }, {});

            if (this._immutable)
            return Object.freeze(json);
            return json;
        } }]);return KeyMap;}();exports.default = KeyMap;