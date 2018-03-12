'use strict';Object.defineProperty(exports, "__esModule", { value: true });var _createClass = function () {function defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}return function (Constructor, protoProps, staticProps) {if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;};}();
/**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  * References
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  */var _templateObject = _taggedTemplateLiteral(['', ' as a string'], ['', ' as a string']),_templateObject2 = _taggedTemplateLiteral(['', ' as a number'], ['', ' as a number']);
var _enforceJs = require('enforce-js');var _enforceJs2 = _interopRequireDefault(_enforceJs);
var _object = require('./object');var _object2 = _interopRequireDefault(_object);
var _error = require('../utils/error');var _error2 = _interopRequireDefault(_error);
var _constants = require('../utils/constants');
var _constraintMap = require('../utils/constraint-map');var _constraintMap2 = _interopRequireDefault(_constraintMap);
var _collection = require('../utils/collection');var _collection2 = _interopRequireDefault(_collection);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}function _asyncToGenerator(fn) {return function () {var gen = fn.apply(this, arguments);return new Promise(function (resolve, reject) {function step(key, arg) {try {var info = gen[key](arg);var value = info.value;} catch (error) {reject(error);return;}if (info.done) {resolve(value);} else {return Promise.resolve(value).then(function (value) {step("next", value);}, function (err) {step("throw", err);});}}return step("next");});};}function _taggedTemplateLiteral(strings, raw) {return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } }));}function _possibleConstructorReturn(self, call) {if (!self) {throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return call && (typeof call === "object" || typeof call === "function") ? call : self;}function _inherits(subClass, superClass) {if (typeof superClass !== "function" && superClass !== null) {throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);}subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;}function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}var



Query = function () {











    function Query(className) {_classCallCheck(this, Query);this._select = [];this._include = [];this._where = new _constraintMap2.default();this._sort = [];
        // Check if className is a string
        if (typeof className === 'string') {
            // Get the name as a string
            var name = className;

            // Extend Warp.Object and use the new className
            this._class = function (_Object2) {_inherits(_class, _Object2);function _class() {_classCallCheck(this, _class);return _possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).apply(this, arguments));}_createClass(_class, [{ key: 'className', get: function get() {return name;} }]);return _class;}(_object2.default);
        }
        // Check if className is a Warp.Object
        else if (new className() instanceof _object2.default) {
                this._class = className;
            }
            // Throw an error
            else
                throw new _error2.default(_error2.default.Code.ForbiddenOperation, '`className` must be a string or a `Warp.Object`');
    }_createClass(Query, [{ key: '_set', value: function _set(







        key, constraint, value) {
            (0, _enforceJs2.default)(_templateObject, { key: key });
            this._where.set(key, constraint, value);
            return this;
        } }, { key: 'equalTo', value: function equalTo(

        key, value) {
            this._set(key, _constraintMap.Constraints.EqualTo, value);
            return this;
        } }, { key: 'notEqualTo', value: function notEqualTo(

        key, value) {
            this._set(key, _constraintMap.Constraints.NotEqualTo, value);
            return this;
        } }, { key: 'greaterThan', value: function greaterThan(

        key, value) {
            this._set(key, _constraintMap.Constraints.GreaterThan, value);
            return this;
        } }, { key: 'greaterThanOrEqualTo', value: function greaterThanOrEqualTo(

        key, value) {
            this._set(key, _constraintMap.Constraints.GreaterThanOrEqualTo, value);
            return this;
        } }, { key: 'lessThan', value: function lessThan(

        key, value) {
            this._set(key, _constraintMap.Constraints.LessThan, value);
            return this;
        } }, { key: 'lessThanOrEqualTo', value: function lessThanOrEqualTo(

        key, value) {
            this._set(key, _constraintMap.Constraints.LessThanOrEqualTo, value);
            return this;
        } }, { key: 'exists', value: function exists(

        key) {
            this._set(key, _constraintMap.Constraints.Exists, true);
            return this;
        } }, { key: 'doesNotExist', value: function doesNotExist(

        key) {
            this._set(key, _constraintMap.Constraints.Exists, false);
            return this;
        } }, { key: 'containedIn', value: function containedIn(

        key, value) {
            this._set(key, _constraintMap.Constraints.ContainedIn, value);
            return this;
        } }, { key: 'notContainedIn', value: function notContainedIn(

        key, value) {
            this._set(key, _constraintMap.Constraints.NotContainedIn, value);
            return this;
        } }, { key: 'containedInOrDoesNotExist', value: function containedInOrDoesNotExist(

        key, value) {
            this._set(key, _constraintMap.Constraints.ContainedInOrDoesNotExist, value);
            return this;
        } }, { key: 'startsWith', value: function startsWith(

        key, value) {
            this._set(key, _constraintMap.Constraints.StartsWith, value);
            return this;
        } }, { key: 'endsWith', value: function endsWith(

        key, value) {
            this._set(key, _constraintMap.Constraints.EndsWith, value);
            return this;
        } }, { key: 'contains', value: function contains(

        key, value) {
            this._set(key, _constraintMap.Constraints.Contains, value);
            return this;
        } }, { key: 'containsEither', value: function containsEither(

        key, value) {
            this._set(key, _constraintMap.Constraints.ContainsEither, value);
            return this;
        } }, { key: 'containsAll', value: function containsAll(

        key, value) {
            this._set(key, _constraintMap.Constraints.ContainsAll, value);
            return this;
        }

        // TODO
    }, { key: 'foundIn', value: function foundIn(key, value) {
            this._set(key, _constraintMap.Constraints.FoundIn, value);
            return this;
        } }, { key: 'foundInEither', value: function foundInEither(

        key, value) {
            this._set(key, _constraintMap.Constraints.FoundInEither, value);
            return this;
        } }, { key: 'foundInAll', value: function foundInAll(

        key, value) {
            this._set(key, _constraintMap.Constraints.FoundInAll, value);
            return this;
        } }, { key: 'notFoundIn', value: function notFoundIn(

        key, value) {
            this._set(key, _constraintMap.Constraints.NotFoundIn, value);
            return this;
        } }, { key: 'notFoundInEither', value: function notFoundInEither(

        key, value) {
            this._set(key, _constraintMap.Constraints.NotFoundInEither, value);
            return this;
        } }, { key: 'select', value: function select()

        {for (var _len = arguments.length, keys = Array(_len), _key = 0; _key < _len; _key++) {keys[_key] = arguments[_key];}
            // Check if first key is an array
            if (!keys) throw new _error2.default(_error2.default.Code.MissingConfiguration, 'Select key must be a string or an array of strings');
            var keyList = keys[0] instanceof Array ? keys[0] : keys;

            // Loop through the keys
            var _iteratorNormalCompletion = true;var _didIteratorError = false;var _iteratorError = undefined;try {for (var _iterator = keyList[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {var key = _step.value;
                    (0, _enforceJs2.default)(_templateObject, { key: key });
                    this._select.push(key);
                }} catch (err) {_didIteratorError = true;_iteratorError = err;} finally {try {if (!_iteratorNormalCompletion && _iterator.return) {_iterator.return();}} finally {if (_didIteratorError) {throw _iteratorError;}}}

            return this;
        } }, { key: 'include', value: function include()

        {for (var _len2 = arguments.length, keys = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {keys[_key2] = arguments[_key2];}
            // Check if first key is an array
            if (!keys) throw new _error2.default(_error2.default.Code.MissingConfiguration, 'Include key must be a string or an array of strings');
            var keyList = keys[0] instanceof Array ? keys[0] : keys;

            // Loop through the keys
            var _iteratorNormalCompletion2 = true;var _didIteratorError2 = false;var _iteratorError2 = undefined;try {for (var _iterator2 = keyList[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {var key = _step2.value;
                    (0, _enforceJs2.default)(_templateObject, { key: key });
                    this._include.push(key);
                }} catch (err) {_didIteratorError2 = true;_iteratorError2 = err;} finally {try {if (!_iteratorNormalCompletion2 && _iterator2.return) {_iterator2.return();}} finally {if (_didIteratorError2) {throw _iteratorError2;}}}
            return this;
        } }, { key: 'sortBy', value: function sortBy()

        {for (var _len3 = arguments.length, keys = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {keys[_key3] = arguments[_key3];}
            // Check if first key is an array
            if (!keys) throw new _error2.default(_error2.default.Code.MissingConfiguration, 'SortBy key must be a string or an array of strings');
            var keyList = keys[0] instanceof Array ? keys[0] : keys;

            // Loop through the keys
            var _iteratorNormalCompletion3 = true;var _didIteratorError3 = false;var _iteratorError3 = undefined;try {for (var _iterator3 = keyList[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {var key = _step3.value;
                    (0, _enforceJs2.default)(_templateObject, { key: key });
                    this._sort.push(key);
                }} catch (err) {_didIteratorError3 = true;_iteratorError3 = err;} finally {try {if (!_iteratorNormalCompletion3 && _iterator3.return) {_iterator3.return();}} finally {if (_didIteratorError3) {throw _iteratorError3;}}}
            return this;
        } }, { key: 'sortByDescending', value: function sortByDescending()

        {for (var _len4 = arguments.length, keys = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {keys[_key4] = arguments[_key4];}
            // Check if first key is an array
            if (!keys) throw new _error2.default(_error2.default.Code.MissingConfiguration, 'SortByDescending key must be a string or an array of strings');
            var keyList = keys[0] instanceof Array ? keys[0] : keys;

            // Loop through the keys
            var _iteratorNormalCompletion4 = true;var _didIteratorError4 = false;var _iteratorError4 = undefined;try {for (var _iterator4 = keyList[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {var key = _step4.value;
                    (0, _enforceJs2.default)(_templateObject, { key: key });
                    this._sort.push('-' + key);
                }} catch (err) {_didIteratorError4 = true;_iteratorError4 = err;} finally {try {if (!_iteratorNormalCompletion4 && _iterator4.return) {_iterator4.return();}} finally {if (_didIteratorError4) {throw _iteratorError4;}}}
            return this;
        } }, { key: 'skip', value: function skip(

        value) {
            (0, _enforceJs2.default)(_templateObject2, { skip: value });
            this._skip = value;
            return this;
        } }, { key: 'limit', value: function limit(

        value) {
            (0, _enforceJs2.default)(_templateObject2, { limit: value });
            this._limit = value;
            return this;
        } }, { key: 'find', value: function () {var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(

            callback) {var sessionToken, className, select, include, where, sort, skip, limit, result, objects, _iteratorNormalCompletion5, _didIteratorError5, _iteratorError5, _iterator5, _step5, data, id, objectClass, object, collection, next;return regeneratorRuntime.wrap(function _callee$(_context) {while (1) {switch (_context.prev = _context.next) {case 0:
                                // Prepare params
                                sessionToken = this.constructor._storage.get(_constants.InternalKeys.Auth.SessionToken);
                                className = this._class.prototype.className;
                                select = this._select.length > 0 ? this._select : undefined;
                                include = this._include.length > 0 ? this._include : undefined;
                                where = this._where.toJSON();
                                sort = this._sort.length > 0 ? this._sort : undefined;
                                skip = this._skip;
                                limit = this._limit;

                                // Find objects
                                _context.next = 10;return this.constructor._http.find({
                                    sessionToken: sessionToken,
                                    className: className,
                                    select: select,
                                    include: include,
                                    where: where,
                                    sort: sort,
                                    skip: skip,
                                    limit: limit });case 10:result = _context.sent;


                                // Iterate through the result
                                objects = [];_iteratorNormalCompletion5 = true;_didIteratorError5 = false;_iteratorError5 = undefined;_context.prev = 15;
                                for (_iterator5 = result[Symbol.iterator](); !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {data = _step5.value;
                                    // Get the object id
                                    id = data[_constants.InternalKeys.Id];
                                    delete data[_constants.InternalKeys.Id];

                                    // Create a new object
                                    objectClass = this._class;
                                    object = new objectClass(data);

                                    // Automatically set the id and isDirty flag
                                    object._id = id;
                                    object._isDirty = false;

                                    // Push the object
                                    objects.push(object);
                                }

                                // Get collection
                                _context.next = 23;break;case 19:_context.prev = 19;_context.t0 = _context['catch'](15);_didIteratorError5 = true;_iteratorError5 = _context.t0;case 23:_context.prev = 23;_context.prev = 24;if (!_iteratorNormalCompletion5 && _iterator5.return) {_iterator5.return();}case 26:_context.prev = 26;if (!_didIteratorError5) {_context.next = 29;break;}throw _iteratorError5;case 29:return _context.finish(26);case 30:return _context.finish(23);case 31:collection = new _collection2.default(objects);

                                // If callback is provided, use callback
                                if (!(typeof callback === 'function')) {_context.next = 37;break;}
                                next = callback(collection);_context.next = 36;return (
                                    next);case 36:return _context.abrupt('return', _context.sent);case 37:return _context.abrupt('return',



                                collection);case 38:case 'end':return _context.stop();}}}, _callee, this, [[15, 19, 23, 31], [24,, 26, 30]]);}));function find(_x) {return _ref.apply(this, arguments);}return find;}() }, { key: 'first', value: function () {var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(


            callback) {var result, object, next;return regeneratorRuntime.wrap(function _callee2$(_context2) {while (1) {switch (_context2.prev = _context2.next) {case 0:
                                // Prepare params
                                this._skip = 0;
                                this._limit = 1;

                                // Find objects
                                _context2.next = 4;return this.find();case 4:result = _context2.sent;if (!(


                                result.length === 0)) {_context2.next = 7;break;}return _context2.abrupt('return', null);case 7:

                                // Get the object
                                object = result.first();

                                // If callback is provided, use callback
                                if (!(typeof callback === 'function')) {_context2.next = 13;break;}
                                next = callback(object);_context2.next = 12;return (
                                    next);case 12:return _context2.abrupt('return', _context2.sent);case 13:return _context2.abrupt('return',



                                object);case 14:case 'end':return _context2.stop();}}}, _callee2, this);}));function first(_x2) {return _ref2.apply(this, arguments);}return first;}() }, { key: 'get', value: function () {var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(


            id) {var sessionToken, className, select, include, object;return regeneratorRuntime.wrap(function _callee3$(_context3) {while (1) {switch (_context3.prev = _context3.next) {case 0:
                                // Prepare params
                                sessionToken = this.constructor._storage.get(_constants.InternalKeys.Auth.SessionToken);
                                className = this._class.prototype.className;
                                select = this._select.length > 0 ? this._select : undefined;
                                include = this._include.length > 0 ? this._include : undefined;

                                // Find object
                                _context3.next = 6;return this.constructor._http.get({
                                    sessionToken: sessionToken,
                                    className: className,
                                    select: select,
                                    include: include,
                                    id: id });case 6:object = _context3.sent;return _context3.abrupt('return',



                                object);case 8:case 'end':return _context3.stop();}}}, _callee3, this);}));function get(_x3) {return _ref3.apply(this, arguments);}return get;}() }], [{ key: 'initialize', value: function initialize(http, storage) {this._http = http;this._storage = storage;return this;} }]);return Query;}();exports.default = Query;