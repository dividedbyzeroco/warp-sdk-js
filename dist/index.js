'use strict';Object.defineProperty(exports, "__esModule", { value: true });exports.Warp = undefined;var _createClass = function () {function defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}return function (Constructor, protoProps, staticProps) {if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;};}();
/**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           * References
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           */var _templateObject = _taggedTemplateLiteral(['', ' as a string'], ['', ' as a string']),_templateObject2 = _taggedTemplateLiteral(['', ' as an optional string'], ['', ' as an optional string']),_templateObject3 = _taggedTemplateLiteral(['', ' as an optional number'], ['', ' as an optional number']);
require('babel-polyfill');
var _enforceJs = require('enforce-js');var _enforceJs2 = _interopRequireDefault(_enforceJs);
var _object2 = require('./classes/object');var _object3 = _interopRequireDefault(_object2);
var _query = require('./classes/query');var _query2 = _interopRequireDefault(_query);
var _user = require('./classes/user');var _user2 = _interopRequireDefault(_user);
var _function2 = require('./classes/function');var _function3 = _interopRequireDefault(_function2);
var _http = require('./adapters/http');var _http2 = _interopRequireDefault(_http);
var _storage = require('./adapters/storage');var _storage2 = _interopRequireDefault(_storage);
var _collection = require('./utils/collection');var _collection2 = _interopRequireDefault(_collection);
var _error = require('./utils/error');var _error2 = _interopRequireDefault(_error);
var _constants = require('./utils/constants');function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}function _possibleConstructorReturn(self, call) {if (!self) {throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return call && (typeof call === "object" || typeof call === "function") ? call : self;}function _inherits(subClass, superClass) {if (typeof superClass !== "function" && superClass !== null) {throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);}subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;}function _taggedTemplateLiteral(strings, raw) {return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } }));}function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}var




Warp = function () {
    /**
                     * Private properties
                     */









    function Warp(_ref) {var _ref$platform = _ref.platform,platform = _ref$platform === undefined ? 'browser' : _ref$platform,apiKey = _ref.apiKey,masterKey = _ref.masterKey,serverURL = _ref.serverURL,api = _ref.api,sessionToken = _ref.sessionToken,_ref$timeout = _ref.timeout,timeout = _ref$timeout === undefined ? 10 : _ref$timeout,_ref$maxRequests = _ref.maxRequests,maxRequests = _ref$maxRequests === undefined ? 6 : _ref$maxRequests,_ref$supportLegacy = _ref.supportLegacy,supportLegacy = _ref$supportLegacy === undefined ? false : _ref$supportLegacy;_classCallCheck(this, Warp);

        // If platform is 'browser'
        if (platform === 'browser') {
            // Enforce
            (0, _enforceJs2.default)(_templateObject, { apiKey: apiKey });
            (0, _enforceJs2.default)(_templateObject2, { apiKey: apiKey });
            (0, _enforceJs2.default)(_templateObject3, { timeout: timeout });
            (0, _enforceJs2.default)(_templateObject3, { maxRequests: maxRequests });

            if (typeof serverURL !== 'string')
            throw new _error2.default(_error2.default.Code.MissingConfiguration, '`serverURL` must be a string');

            // Modify serverURL to remove trailing slash
            if (serverURL[serverURL.length - 1] === '/')
            serverURL = serverURL.slice(0, serverURL.length - 2);

            // Set http
            this._http = _http2.default.use('browser', { apiKey: apiKey, masterKey: masterKey, serverURL: serverURL, timeout: timeout, maxRequests: maxRequests });

            // Set storage
            this._storage = _storage2.default.use('browser', { prefix: serverURL });
        }

        // If platform is 'api'
        if (platform === 'api') {
            if (typeof api === 'undefined')
            throw new _error2.default(_error2.default.Code.MissingConfiguration, '`api` must be provided when using the api platform');

            // Set http
            this._http = _http2.default.use('api', { api: api });

            // Set storage
            this._storage = _storage2.default.use('api', { prefix: api.apiKey });

            // Set session token
            this._storage.set(_constants.InternalKeys.Auth.SessionToken, sessionToken);
        }

        // Set legacy support
        this._supportLegacy = supportLegacy;

        // Extend the object to allow for multiple instances of http and storage
        // Initialize the object
        var _object = function (_Object2) {_inherits(_object, _Object2);function _object() {_classCallCheck(this, _object);return _possibleConstructorReturn(this, (_object.__proto__ || Object.getPrototypeOf(_object)).apply(this, arguments));}return _object;}(_object3.default);
        this._object = _object.initialize(this._http, this._storage, this._supportLegacy);

        // Extend the query to allow for multiple instances of http and storage
        // Initialize the query
        var query = function (_Query) {_inherits(query, _Query);function query() {_classCallCheck(this, query);return _possibleConstructorReturn(this, (query.__proto__ || Object.getPrototypeOf(query)).apply(this, arguments));}return query;}(_query2.default);
        this._query = query.initialize(this._http, this._storage);

        // Extend the user to allow for multiple instances of http and storage
        var user = function (_User) {_inherits(user, _User);function user() {_classCallCheck(this, user);return _possibleConstructorReturn(this, (user.__proto__ || Object.getPrototypeOf(user)).apply(this, arguments));}return user;}(_user2.default);
        this._user = user.initialize(this._http, this._storage, this._supportLegacy);

        // Extend the function to allow for multiple instances of http and storage
        // Initialize the function
        var _function = function (_Function2) {_inherits(_function, _Function2);function _function() {_classCallCheck(this, _function);return _possibleConstructorReturn(this, (_function.__proto__ || Object.getPrototypeOf(_function)).apply(this, arguments));}return _function;}(_function3.default);
        this._function = _function.initialize(this._http, this._storage);
    }_createClass(Warp, [{ key: 'Object', get: function get()

        {
            return this._object;
        } }, { key: 'Query', get: function get()

        {
            return this._query;
        } }, { key: 'User', get: function get()

        {
            return this._user;
        } }, { key: 'Collection', get: function get()

        {
            return this._collection;
        } }, { key: 'Function', get: function get()

        {
            return this._function;
        } }]);return Warp;}();var


_Warp = function () {function _Warp() {_classCallCheck(this, _Warp);}_createClass(_Warp, null, [{ key: 'initialize', value: function initialize(










        options) {
            this._instance = new Warp(options);
        } }, { key: 'instance', get: function get() {if (typeof this._instance === 'undefined') throw new _error2.default(_error2.default.Code.MissingConfiguration, 'Warp must be initialized before it is used');return this._instance;} }, { key: 'Object', get: function get()

        {
            return this.instance.Object;
        } }, { key: 'Query', get: function get()

        {
            return this.instance.Query;
        } }, { key: 'User', get: function get()

        {
            return this.instance.User;
        } }, { key: 'Collection', get: function get()

        {
            return this.instance.Collection;
        } }, { key: 'Function', get: function get()

        {
            return this.instance.Function;
        } }]);return _Warp;}();exports.default = _Warp;exports.



Warp = Warp;


// Attach Warp to the window if used in a browser
if (typeof window !== 'undefined') window.Warp = _Warp;