'use strict';Object.defineProperty(exports, "__esModule", { value: true });var _createClass = function () {function defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}return function (Constructor, protoProps, staticProps) {if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;};}();
/**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  * Reference
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  */
var _error = require('../../utils/error');var _error2 = _interopRequireDefault(_error);

var _browser = require('./browser');var _browser2 = _interopRequireDefault(_browser);
var _api = require('./api');var _api2 = _interopRequireDefault(_api);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}var

Http = function () {function Http() {_classCallCheck(this, Http);}_createClass(Http, null, [{ key: 'use',






        /**
                                                                                                           * Static use
                                                                                                           * @param {String} platform
                                                                                                           */value: function use(
        platform, config) {
            // Get http platform
            var http = this.Platform[platform];

            // Check if platform exists
            if (typeof http === 'undefined')
            throw new _error2.default(_error2.default.Code.MissingConfiguration, 'Http `' + platform + '` is not supported');else

            return new http(config);
        } }]);return Http;}();Http.Platform = Object.freeze({ 'browser': _browser2.default, 'api': _api2.default });exports.default = Http;