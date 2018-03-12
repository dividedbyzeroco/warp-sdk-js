'use strict';Object.defineProperty(exports, "__esModule", { value: true });var _createClass = function () {function defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}return function (Constructor, protoProps, staticProps) {if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;};}();function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}var








APIStorageAdapter = function () {




    function APIStorageAdapter(config) {_classCallCheck(this, APIStorageAdapter);this._client = {};
        // Get params
        var prefix = config.prefix;

        // Set key and url
        this._prefix = prefix;
    }_createClass(APIStorageAdapter, [{ key: '_getKey', value: function _getKey(

        key) {
            return this._prefix + ':' + key;
        } }, { key: 'set', value: function set(

        key, value) {
            this._client[this._getKey(key)] = value;
        } }, { key: 'get', value: function get(

        key) {
            var item = this._client[this._getKey(key)];

            if (item === null) return undefined;
            return item;
        } }, { key: 'remove', value: function remove(

        key) {
            delete this._client[this._getKey(key)];
        } }]);return APIStorageAdapter;}(); /**
                                             * References
                                             */exports.default = APIStorageAdapter;