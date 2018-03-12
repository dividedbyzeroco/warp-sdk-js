'use strict';Object.defineProperty(exports, "__esModule", { value: true });var _extends = Object.assign || function (target) {for (var i = 1; i < arguments.length; i++) {var source = arguments[i];for (var key in source) {if (Object.prototype.hasOwnProperty.call(source, key)) {target[key] = source[key];}}}return target;};var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {return typeof obj;} : function (obj) {return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;};var _createClass = function () {function defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}return function (Constructor, protoProps, staticProps) {if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;};}();
/**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  * References
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  */var _templateObject = _taggedTemplateLiteral(['', ' as a number'], ['', ' as a number']),_templateObject2 = _taggedTemplateLiteral(['', ' as a string'], ['', ' as a string']);
var _enforceJs = require('enforce-js');var _enforceJs2 = _interopRequireDefault(_enforceJs);
var _error = require('../utils/error');var _error2 = _interopRequireDefault(_error);
var _constants = require('../utils/constants');
var _keyMap = require('../utils/key-map');var _keyMap2 = _interopRequireDefault(_keyMap);
var _format = require('../utils/format');function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}function _defineProperty(obj, key, value) {if (key in obj) {Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });} else {obj[key] = value;}return obj;}function _asyncToGenerator(fn) {return function () {var gen = fn.apply(this, arguments);return new Promise(function (resolve, reject) {function step(key, arg) {try {var info = gen[key](arg);var value = info.value;} catch (error) {reject(error);return;}if (info.done) {resolve(value);} else {return Promise.resolve(value).then(function (value) {step("next", value);}, function (err) {step("throw", err);});}}return step("next");});};}function _taggedTemplateLiteral(strings, raw) {return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } }));}function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}var




_Object = function () {












    function _Object() {_classCallCheck(this, _Object);this._keyMap = new _keyMap2.default();this._isDirty = false;
        if (arguments.length > 0) {
            if (typeof (arguments.length <= 0 ? undefined : arguments[0]) === 'string') {
                if (typeof this.className !== 'undefined')
                throw new _error2.default(_error2.default.Code.ForbiddenOperation, 'A className has already been defined for the Warp Object');

                // Set className
                this._className = arguments.length <= 0 ? undefined : arguments[0];

                // Set keys
                if (arguments.length > 1 && _typeof(arguments.length <= 1 ? undefined : arguments[1]) === 'object' && (arguments.length <= 1 ? undefined : arguments[1]) !== null) {
                    var keys = arguments.length <= 1 ? undefined : arguments[1];
                    this._keyMap = new _keyMap2.default(keys);
                    this._isDirty = true;
                }
            } else
            if (_typeof(arguments.length <= 0 ? undefined : arguments[0]) === 'object' && (arguments.length <= 1 ? undefined : arguments[1]) !== null) {
                // Check if the class is a subclass
                if (typeof this.className === 'undefined')
                throw new _error2.default(_error2.default.Code.MissingConfiguration, 'Only extended Warp Objects can have keys as the first argument');

                // Set keys
                var _keys = arguments.length <= 0 ? undefined : arguments[0];
                this._keyMap = new _keyMap2.default(_keys);
                this._isDirty = true;
            }
        } else
        if (typeof this.className === 'undefined')
        throw new _error2.default(_error2.default.Code.MissingConfiguration, 'The parameters for Warp Object are invalid');
    }_createClass(_Object, [{ key: 'set',













































        /**
                                           * Generic setter for all keys
                                           * @param {String} key 
                                           * @param {*} value 
                                           */value: function set(
        key, value) {
            // Check the key
            if (_constants.InternalKeys.Id === key ||
            _constants.InternalKeys.CreatedAt === key ||
            _constants.InternalKeys.UpdatedAt === key ||
            _constants.InternalKeys.DeletedAt === key) {
                // If it is an internal key
                throw new _error2.default(_error2.default.Code.ForbiddenOperation, 'Cannot manually set `' + key + '` because it is an internal key');
            } else
            if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' && value !== null && value instanceof _Object) {
                // Check if id exists
                if (value.id <= 0) {
                    throw new _error2.default(_error2.default.Code.ForbiddenOperation, 'Cannot set `' + key + '` as a pointer because it is unsaved, please save it before using');
                }

                // Set to pointer
                this._keyMap.set(key, value.toPointer().toJSON());
            } else
            this._keyMap.set(key, value);

            // Flag data as dirty/unsaved
            this._isDirty = true;
        }

        /**
           * Generic getter for all keys
           * @param {String} key 
           * @param {*} value 
           */ }, { key: 'get', value: function get(
        key) {
            // Check the key
            if (_constants.InternalKeys.Id === key ||
            _constants.InternalKeys.CreatedAt === key ||
            _constants.InternalKeys.UpdatedAt === key ||
            _constants.InternalKeys.DeletedAt === key) {
                // If it is an internal key
                throw new _error2.default(_error2.default.Code.ForbiddenOperation, 'Cannot manually get `' + key + '` because it is an internal key');
            }

            // Get value
            var value = this._keyMap.get(key);

            // If the value is for a pointer, return a new object
            if (this.constructor.pointerIsImplementedBy(value)) {
                return this.constructor.toObject(value);
            } else
            if (this.constructor.specialsIsImplementedBy(value)) {
                return undefined;
            }
            // Otherwise, get the KeyMap value
            else return value;
        } }, { key: 'increment', value: function increment(

        key, value) {
            // Enforce 
            (0, _enforceJs2.default)(_templateObject, { value: value });

            // Set the value to an increment object
            var increment = { type: 'Increment', value: value };
            this._keyMap.set(key, increment);
        } }, { key: 'json', value: function json(

        key) {
            var keyMap = this._keyMap;

            return {
                set: function set(path, value) {
                    // Enforce
                    (0, _enforceJs2.default)(_templateObject2, { path: path });

                    // Set the value to a SetJSON object
                    var setJSON = { type: 'SetJson', path: path, value: value };
                    keyMap.set(key, setJSON);
                },
                append: function append(path, value) {
                    // Enforce
                    (0, _enforceJs2.default)(_templateObject2, { path: path });

                    // Set the value to a SetJSON object
                    var setJSON = { type: 'AppendJson', path: path, value: value };
                    keyMap.set(key, setJSON);
                } };

        } }, { key: 'save', value: function () {var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {var sessionToken, className, keys, id, result, keyMap;return regeneratorRuntime.wrap(function _callee$(_context) {while (1) {switch (_context.prev = _context.next) {case 0:if (



















                                this._isDirty) {_context.next = 2;break;}return _context.abrupt('return', this);case 2:

                                // Prepare params
                                sessionToken = this.constructor._storage.get(_constants.InternalKeys.Auth.SessionToken);
                                className = this.className;
                                keys = this._keyMap.toJSON();
                                id = this.id;_context.next = 8;return (

                                    this.constructor._http.save({ sessionToken: sessionToken, className: className, keys: keys, id: id }));case 8:result = _context.sent;

                                keyMap = new _keyMap2.default(result);
                                keyMap.remove(_constants.InternalKeys.Id);
                                this._keyMap = keyMap;

                                // Flag data as clean/saved
                                this._isDirty = false;return _context.abrupt('return',

                                this);case 14:case 'end':return _context.stop();}}}, _callee, this);}));function save() {return _ref.apply(this, arguments);}return save;}() }, { key: 'destroy', value: function () {var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {var sessionToken, className, id, result, keyMap;return regeneratorRuntime.wrap(function _callee2$(_context2) {while (1) {switch (_context2.prev = _context2.next) {case 0:



                                // Prepare params
                                sessionToken = this.constructor._storage.get(_constants.InternalKeys.Auth.SessionToken);
                                className = this.className;
                                id = this.id;if (!(

                                typeof id === 'undefined')) {_context2.next = 5;break;}throw (
                                    new _error2.default(_error2.default.Code.ForbiddenOperation, 'Cannot destroy an unsaved object'));case 5:_context2.next = 7;return (


                                    this.constructor._http.destroy({ sessionToken: sessionToken, className: className, id: id }));case 7:result = _context2.sent;

                                keyMap = new _keyMap2.default(result);
                                keyMap.remove(_constants.InternalKeys.Id);
                                this._keyMap = keyMap;

                                // Flag data as clean/saved
                                this._isDirty = false;return _context2.abrupt('return',

                                this);case 13:case 'end':return _context2.stop();}}}, _callee2, this);}));function destroy() {return _ref2.apply(this, arguments);}return destroy;}() }, { key: 'fetch', value: function () {var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {var sessionToken, className, id, result, keyMap;return regeneratorRuntime.wrap(function _callee3$(_context3) {while (1) {switch (_context3.prev = _context3.next) {case 0:



                                // Prepare params
                                sessionToken = this.constructor._storage.get('sessionToken');
                                className = this.className;
                                id = this.id;_context3.next = 5;return (

                                    this.constructor._http.get({ sessionToken: sessionToken, className: className, id: id }));case 5:result = _context3.sent;

                                keyMap = new _keyMap2.default(result);
                                keyMap.remove(_constants.InternalKeys.Id);
                                this._keyMap = keyMap;return _context3.abrupt('return',

                                this);case 10:case 'end':return _context3.stop();}}}, _callee3, this);}));function fetch() {return _ref3.apply(this, arguments);}return fetch;}() }, { key: 'toPointer', value: function toPointer()


        {
            this._isPointer = true;
            return this;
        } }, { key: 'toJSON', value: function toJSON()

        {var _extends3;
            // Get keys
            var id = this.id,createdAt = this.createdAt,updatedAt = this.updatedAt;
            var keys = {};

            // If object is a pointer, omit keys
            if (this._isPointer)
            keys = _defineProperty({
                type: 'Pointer' },
            this.constructor._supportLegacy ? _constants.InternalKeys.Pointers.LegacyClassName :
            _constants.InternalKeys.Pointers.ClassName, this.className);else

            {
                // Iterate through each key in key map
                var _iteratorNormalCompletion = true;var _didIteratorError = false;var _iteratorError = undefined;try {for (var _iterator = this._keyMap.getAliases()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {var key = _step.value;
                        // If the key is a timestamp, skip it
                        if (_constants.InternalKeys.Timestamps.CreatedAt === key ||
                        _constants.InternalKeys.Timestamps.UpdatedAt === key ||
                        _constants.InternalKeys.Timestamps.DeletedAt === key)
                        continue;

                        // Get the key descriptor
                        var keyDescriptor = Object.getOwnPropertyDescriptor(this.constructor.prototype, (0, _format.toCamelCase)(key));

                        // Check if key descriptor exists
                        if (keyDescriptor && typeof keyDescriptor['get'] === 'function') {
                            var getter = keyDescriptor['get'].bind(this);
                            keys[key] = getter();
                        } else

                        keys[key] = this.get(key);
                    }} catch (err) {_didIteratorError = true;_iteratorError = err;} finally {try {if (!_iteratorNormalCompletion && _iterator.return) {_iterator.return();}} finally {if (_didIteratorError) {throw _iteratorError;}}}
            }

            // Return the object
            return _extends(_defineProperty({},
            _constants.InternalKeys.Id, id),
            keys, (_extends3 = {}, _defineProperty(_extends3,
            _constants.InternalKeys.Timestamps.CreatedAt, createdAt), _defineProperty(_extends3,
            _constants.InternalKeys.Timestamps.UpdatedAt, updatedAt), _extends3));

        } }, { key: 'className', get: function get() {return this._className;} }, { key: 'id', get: function get() {return this._id;} }, { key: 'createdAt', get: function get() {return this._keyMap.get(_constants.InternalKeys.Timestamps.CreatedAt);} }, { key: 'updatedAt', get: function get() {return this._keyMap.get(_constants.InternalKeys.Timestamps.UpdatedAt);} }, { key: 'deletedAt', get: function get() {return this._keyMap.get(_constants.InternalKeys.Timestamps.DeletedAt);} }], [{ key: 'initialize', value: function initialize(http, storage, supportLegacy) {this._http = http;this._storage = storage;this._supportLegacy = supportLegacy;return this;} }, { key: 'createWithoutData', value: function createWithoutData(id, className) {var object = new this(className);object._id = id;return object;} }, { key: 'toObject', value: function toObject(value) {var id = value.id,attributes = value.attributes;var object = this.createWithoutData(id); // If attributes exist, store in keyMap
            if (typeof attributes !== 'undefined') {object._keyMap = new _keyMap2.default(attributes);}return object;} }, { key: 'pointerIsImplementedBy', value: function pointerIsImplementedBy(value) {if (value === null) return false;if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) !== 'object') return false;if (value.type !== 'Pointer') return false;if (value.id <= 0) return false;return true;} }, { key: 'specialsIsImplementedBy', value: function specialsIsImplementedBy(value) {if (value === null) return false;if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) !== 'object') return false;if (typeof value.type === 'undefined') return false;return true;} }]);return _Object;}();_Object._supportLegacy = false;exports.default = _Object;