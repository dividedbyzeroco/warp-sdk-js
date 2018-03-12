'use strict';Object.defineProperty(exports, "__esModule", { value: true });var _createClass = function () {function defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}return function (Constructor, protoProps, staticProps) {if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;};}();



var _object = require('./object');var _object2 = _interopRequireDefault(_object);
var _error = require('../utils/error');var _error2 = _interopRequireDefault(_error);
var _format = require('../utils/format');
var _constants = require('../utils/constants');function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}function _asyncToGenerator(fn) {return function () {var gen = fn.apply(this, arguments);return new Promise(function (resolve, reject) {function step(key, arg) {try {var info = gen[key](arg);var value = info.value;} catch (error) {reject(error);return;}if (info.done) {resolve(value);} else {return Promise.resolve(value).then(function (value) {step("next", value);}, function (err) {step("throw", err);});}}return step("next");});};}function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _possibleConstructorReturn(self, call) {if (!self) {throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return call && (typeof call === "object" || typeof call === "function") ? call : self;}function _inherits(subClass, superClass) {if (typeof superClass !== "function" && superClass !== null) {throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);}subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;} /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       * References
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       */var
User = function (_Object2) {_inherits(User, _Object2);function User() {_classCallCheck(this, User);return _possibleConstructorReturn(this, (User.__proto__ || Object.getPrototypeOf(User)).apply(this, arguments));}_createClass(User, [{ key: 'className', get: function get()






















































































        {
            return _constants.InternalKeys.Auth.User;
        } }, { key: 'username', get: function get()

        {
            return this.get(_constants.InternalKeys.Auth.Username);
        }, set: function set(





        value) {
            this.set(_constants.InternalKeys.Auth.Username, value);
        } }, { key: 'email', get: function get() {return this.get(_constants.InternalKeys.Auth.Email);}, set: function set(

        value) {
            this.set(_constants.InternalKeys.Auth.Email, value);
        } }, { key: 'password', set: function set(

        value) {
            this.set(_constants.InternalKeys.Auth.Password, value);
        } }], [{ key: '_clearSession', value: function _clearSession() {this._storage.remove(_constants.InternalKeys.Auth.SessionToken);this._storage.remove(_constants.InternalKeys.Auth.RevokedAt);this._storage.remove(_constants.InternalKeys.Auth.User);this._currentUser = undefined;} }, { key: 'current', value: function current() {// If current user is undefined
            if (typeof this._currentUser === 'undefined') {// Get revokedAt and user
                var revokedAt = this._storage.get(_constants.InternalKeys.Auth.RevokedAt);var storedUser = this._storage.get(_constants.InternalKeys.Auth.User);var revokedAtDate = (0, _format.toDateTime)(revokedAt); // Check if session expired
                if (revokedAtDate.getTime() < (0, _format.toDateTime)().getTime()) {this._clearSession();throw new _error2.default(_error2.default.Code.InvalidSessionToken, 'Session expired. Try logging in again.');} // If stored user exists
                if (typeof storedUser !== 'undefined') {try {// Get parsed user
                        var parsedUser = JSON.parse(storedUser);var id = parsedUser[_constants.InternalKeys.Id];delete parsedUser[_constants.InternalKeys.Id]; // Create a new user
                        var user = new this(parsedUser);user._id = id;user._isDirty = false; // Set the new user as the current user
                        this._currentUser = user;} catch (err) {throw new _error2.default(_error2.default.Code.ForbiddenOperation, 'Current user data is malformed. Try logging out or clearing browser cache.');}}} // Return the current user
            return this._currentUser;} }, { key: 'logIn', value: function () {var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(options) {var session, sessionToken, revokedAt;return regeneratorRuntime.wrap(function _callee$(_context) {while (1) {switch (_context.prev = _context.next) {case 0:_context.next = 2;return this._http.logIn(options);case 2:session = _context.sent;sessionToken = session[_constants.InternalKeys.Auth.SessionToken];revokedAt = session[_constants.InternalKeys.Auth.RevokedAt];_context.next = 7;return this.become({ sessionToken: sessionToken, revokedAt: revokedAt });case 7:return _context.abrupt('return', _context.sent);case 8:case 'end':return _context.stop();}}}, _callee, this);}));function logIn(_x) {return _ref.apply(this, arguments);}return logIn;}() }, { key: 'become', value: function () {var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(_ref2) {var sessionToken = _ref2.sessionToken,revokedAt = _ref2.revokedAt;var user, revokedAtString, current;return regeneratorRuntime.wrap(function _callee2$(_context2) {while (1) {switch (_context2.prev = _context2.next) {case 0:_context2.next = 2;return this._http.become({ sessionToken: sessionToken });case 2:user = _context2.sent;revokedAtString = revokedAt ? new Date(revokedAt).toISOString() : new Date().toISOString(); // Set the session token and the current user
                                this._storage.set(_constants.InternalKeys.Auth.SessionToken, sessionToken);this._storage.set(_constants.InternalKeys.Auth.RevokedAt, revokedAtString);this._storage.set(_constants.InternalKeys.Auth.User, JSON.stringify(user)); // Get current user
                                current = this.current();if (!(typeof current === 'undefined')) {_context2.next = 12;break;}throw new _error2.default(_error2.default.Code.InvalidSessionToken, 'Invalid session token');case 12:return _context2.abrupt('return', current);case 13:case 'end':return _context2.stop();}}}, _callee2, this);}));function become(_x2) {return _ref3.apply(this, arguments);}return become;}() }, { key: 'logOut', value: function () {var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(_ref4) {var sessionToken = _ref4.sessionToken;return regeneratorRuntime.wrap(function _callee3$(_context3) {while (1) {switch (_context3.prev = _context3.next) {case 0:_context3.next = 2;return this._http.logOut({ sessionToken: sessionToken });case 2: // Remove session details
                                this._clearSession();case 3:case 'end':return _context3.stop();}}}, _callee3, this);}));function logOut(_x3) {return _ref5.apply(this, arguments);}return logOut;}() }]);return User;}(_object2.default);exports.default = User;