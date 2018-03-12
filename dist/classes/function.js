'use strict';Object.defineProperty(exports, "__esModule", { value: true });var _createClass = function () {function defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}return function (Constructor, protoProps, staticProps) {if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;};}();
/**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  * References
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  */var _templateObject = _taggedTemplateLiteral(['', ' as a string'], ['', ' as a string']),_templateObject2 = _taggedTemplateLiteral(['', ' as an optional object'], ['', ' as an optional object']);
var _enforceJs = require('enforce-js');var _enforceJs2 = _interopRequireDefault(_enforceJs);
var _constants = require('../utils/constants');function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}function _taggedTemplateLiteral(strings, raw) {return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } }));}function _asyncToGenerator(fn) {return function () {var gen = fn.apply(this, arguments);return new Promise(function (resolve, reject) {function step(key, arg) {try {var info = gen[key](arg);var value = info.value;} catch (error) {reject(error);return;}if (info.done) {resolve(value);} else {return Promise.resolve(value).then(function (value) {step("next", value);}, function (err) {step("throw", err);});}}return step("next");});};}function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}var



_Function = function () {function _Function() {_classCallCheck(this, _Function);}_createClass(_Function, null, [{ key: 'initialize', value: function initialize(




        http, storage) {
            this._http = http;
            this._storage = storage;
            return this;
        } }, { key: 'run', value: function () {var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(

            functionName, keys, callback) {var sessionToken, result;return regeneratorRuntime.wrap(function _callee$(_context) {while (1) {switch (_context.prev = _context.next) {case 0:
                                // Enforce
                                (0, _enforceJs2.default)(_templateObject, { functionName: functionName });
                                (0, _enforceJs2.default)(_templateObject2, { keys: keys });

                                // Get session token
                                sessionToken = this._storage.get(_constants.InternalKeys.Auth.SessionToken);

                                // Run the function
                                _context.next = 5;return this._http.run({ sessionToken: sessionToken, functionName: functionName, keys: keys });case 5:result = _context.sent;if (!(


                                typeof callback === 'function')) {_context.next = 10;break;}_context.next = 9;return (
                                    callback(result));case 9:return _context.abrupt('return', _context.sent);case 10:return _context.abrupt('return',



                                result);case 11:case 'end':return _context.stop();}}}, _callee, this);}));function run(_x, _x2, _x3) {return _ref.apply(this, arguments);}return run;}() }]);return _Function;}();exports.default = _Function;