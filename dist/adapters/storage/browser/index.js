'use strict';Object.defineProperty(exports, "__esModule", { value: true });var _createClass = function () {function defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}return function (Constructor, protoProps, staticProps) {if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;};}();function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}var








BrowserStorageAdapter = function () {




    function BrowserStorageAdapter(config) {_classCallCheck(this, BrowserStorageAdapter);this._client = localStorage;
        // Get params
        var prefix = config.prefix;

        // Set key and url
        this._prefix = prefix;
    }_createClass(BrowserStorageAdapter, [{ key: '_getKey', value: function _getKey(

        key) {
            return this._prefix + ':' + key;
        } }, { key: 'set', value: function set(

        key, value) {
            if (typeof value !== 'undefined') this._client.setItem(this._getKey(key), value);
        } }, { key: 'get', value: function get(

        key) {
            var item = this._client.getItem(this._getKey(key));

            if (item === null) return undefined;
            return item;
        } }, { key: 'remove', value: function remove(

        key) {
            this._client.removeItem(this._getKey(key));
        } }]);return BrowserStorageAdapter;}(); /**
                                                 * References
                                                 */exports.default = BrowserStorageAdapter;