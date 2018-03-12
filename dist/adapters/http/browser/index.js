'use strict';Object.defineProperty(exports, "__esModule", { value: true });var _createClass = function () {function defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}return function (Constructor, protoProps, staticProps) {if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;};}();
/**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  * References
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  */
var _error = require('../../../utils/error');var _error2 = _interopRequireDefault(_error);
var _queue = require('../../../utils/queue');var _queue2 = _interopRequireDefault(_queue);
var _constants = require('../../../utils/constants');function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}function _asyncToGenerator(fn) {return function () {var gen = fn.apply(this, arguments);return new Promise(function (resolve, reject) {function step(key, arg) {try {var info = gen[key](arg);var value = info.value;} catch (error) {reject(error);return;}if (info.done) {resolve(value);} else {return Promise.resolve(value).then(function (value) {step("next", value);}, function (err) {step("throw", err);});}}return step("next");});};}function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}var













BrowserHttpAdapter = function () {







    function BrowserHttpAdapter(config) {_classCallCheck(this, BrowserHttpAdapter);this._requestInterval = 200;
        // Get params
        var apiKey = config.apiKey,masterKey = config.masterKey,serverURL = config.serverURL,timeout = config.timeout,maxRequests = config.maxRequests;

        // Set key and url
        this._apiKey = apiKey || '';
        this._masterKey = masterKey;
        this._serverURL = serverURL || '';
        this._queue = new _queue2.default(maxRequests || 6, this._requestInterval, timeout || 10);
    }_createClass(BrowserHttpAdapter, [{ key: 'logIn', value: function () {var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(_ref) {var

                username = _ref.username,email = _ref.email,password = _ref.password;var url, keys, request, result;return regeneratorRuntime.wrap(function _callee$(_context) {while (1) {switch (_context.prev = _context.next) {case 0:
                                // Prepare url
                                url = this._serverURL + '/login';

                                // Prepare keys
                                keys = {
                                    username: username,
                                    email: email,
                                    password: password };


                                // Log in
                                request = this._send(url, 'POST', undefined, keys);_context.next = 5;return (
                                    this._queue.push(request));case 5:result = _context.sent;return _context.abrupt('return',
                                result);case 7:case 'end':return _context.stop();}}}, _callee, this);}));function logIn(_x) {return _ref2.apply(this, arguments);}return logIn;}() }, { key: 'become', value: function () {var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(_ref3) {var


                sessionToken = _ref3.sessionToken;var url, request, result;return regeneratorRuntime.wrap(function _callee2$(_context2) {while (1) {switch (_context2.prev = _context2.next) {case 0:
                                // Prepare url
                                url = this._serverURL + '/users/me';

                                // Become session
                                request = this._send(url, 'GET', sessionToken);_context2.next = 4;return (
                                    this._queue.push(request));case 4:result = _context2.sent;return _context2.abrupt('return',
                                result);case 6:case 'end':return _context2.stop();}}}, _callee2, this);}));function become(_x2) {return _ref4.apply(this, arguments);}return become;}() }, { key: 'logOut', value: function () {var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(_ref5) {var


                sessionToken = _ref5.sessionToken;var url, request, result;return regeneratorRuntime.wrap(function _callee3$(_context3) {while (1) {switch (_context3.prev = _context3.next) {case 0:
                                // Prepare url
                                url = this._serverURL + '/logout';

                                // Log out
                                request = this._send(url, 'POST', sessionToken);_context3.next = 4;return (
                                    this._queue.push(request));case 4:result = _context3.sent;return _context3.abrupt('return',
                                result);case 6:case 'end':return _context3.stop();}}}, _callee3, this);}));function logOut(_x3) {return _ref6.apply(this, arguments);}return logOut;}() }, { key: 'find', value: function () {var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(_ref7) {var



                className = _ref7.className,
                select = _ref7.select,
                include = _ref7.include,
                where = _ref7.where,
                sort = _ref7.sort,
                skip = _ref7.skip,
                limit = _ref7.limit;var url, urlParams, request, result;return regeneratorRuntime.wrap(function _callee4$(_context4) {while (1) {switch (_context4.prev = _context4.next) {case 0:

                                // Prepare url
                                url = this._serverURL + '/classes/' + className + '?';
                                urlParams = [];

                                // Check if className is for the user or session class
                                if (className === _constants.InternalKeys.Auth.User)
                                url = this._serverURL + '/users?';else
                                if (className === _constants.InternalKeys.Auth.Session)
                                url = this._serverURL + '/sessions?';

                                // Check url params
                                if (typeof select !== 'undefined')
                                urlParams.push('select=' + encodeURIComponent(JSON.stringify(select)));
                                if (typeof include !== 'undefined')
                                urlParams.push('include=' + encodeURIComponent(JSON.stringify(include)));
                                if (typeof where !== 'undefined')
                                urlParams.push('where=' + encodeURIComponent(JSON.stringify(where)));
                                if (typeof sort !== 'undefined')
                                urlParams.push('sort=' + encodeURIComponent(JSON.stringify(sort)));
                                if (typeof skip !== 'undefined')
                                urlParams.push('skip=' + skip);
                                if (typeof limit !== 'undefined')
                                urlParams.push('limit=' + limit);

                                // Add the url params
                                url += urlParams.join('&');

                                // Fetch objects
                                request = this._send(url, 'GET');_context4.next = 13;return (
                                    this._queue.push(request));case 13:result = _context4.sent;return _context4.abrupt('return',
                                result);case 15:case 'end':return _context4.stop();}}}, _callee4, this);}));function find(_x4) {return _ref8.apply(this, arguments);}return find;}() }, { key: 'get', value: function () {var _ref10 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(_ref9) {var


                className = _ref9.className,id = _ref9.id,select = _ref9.select,include = _ref9.include;var url, urlParams, request, result;return regeneratorRuntime.wrap(function _callee5$(_context5) {while (1) {switch (_context5.prev = _context5.next) {case 0:
                                // Prepare url
                                url = this._serverURL + '/classes/' + className + '/' + id + '?';
                                urlParams = [];

                                // Check if className is for the user or session class
                                if (className === _constants.InternalKeys.Auth.User)
                                url = this._serverURL + '/users/' + id + '?';else
                                if (className === _constants.InternalKeys.Auth.Session)
                                url = this._serverURL + '/sessions/' + id + '?';

                                // Check url params
                                if (typeof select !== 'undefined')
                                urlParams.push('select=' + encodeURIComponent(JSON.stringify(select)));
                                if (typeof include !== 'undefined')
                                urlParams.push('include=' + encodeURIComponent(JSON.stringify(include)));

                                // Add the url params
                                url += urlParams.join('&');

                                // Fetch object
                                request = this._send(url, 'GET');_context5.next = 9;return (
                                    this._queue.push(request));case 9:result = _context5.sent;return _context5.abrupt('return',
                                result);case 11:case 'end':return _context5.stop();}}}, _callee5, this);}));function get(_x5) {return _ref10.apply(this, arguments);}return get;}() }, { key: 'save', value: function () {var _ref12 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(_ref11) {var


                sessionToken = _ref11.sessionToken,className = _ref11.className,keys = _ref11.keys,id = _ref11.id;var url, method, request, result;return regeneratorRuntime.wrap(function _callee6$(_context6) {while (1) {switch (_context6.prev = _context6.next) {case 0:
                                // Prepare url
                                url = this._serverURL + '/classes/' + className;

                                // Check if className is for the user or session class
                                if (className === _constants.InternalKeys.Auth.User)
                                url = this._serverURL + '/users';

                                // If id is given, append it to the url
                                if (typeof id !== 'undefined') url += '/' + id;

                                // Prepare method
                                method = typeof id === 'undefined' ? 'POST' : 'PUT';

                                // Save object
                                request = this._send(url, method, sessionToken, keys);_context6.next = 7;return (
                                    this._queue.push(request));case 7:result = _context6.sent;return _context6.abrupt('return',
                                result);case 9:case 'end':return _context6.stop();}}}, _callee6, this);}));function save(_x6) {return _ref12.apply(this, arguments);}return save;}() }, { key: 'destroy', value: function () {var _ref14 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(_ref13) {var


                sessionToken = _ref13.sessionToken,className = _ref13.className,id = _ref13.id;var url, request, result;return regeneratorRuntime.wrap(function _callee7$(_context7) {while (1) {switch (_context7.prev = _context7.next) {case 0:
                                // Prepare url
                                url = this._serverURL + '/classes/' + className + '/' + id;

                                // Check if className is for the user or session class
                                if (className === _constants.InternalKeys.Auth.User)
                                url = this._serverURL + '/users';

                                // Destroy object
                                request = this._send(url, 'DELETE', sessionToken);_context7.next = 5;return (
                                    this._queue.push(request));case 5:result = _context7.sent;return _context7.abrupt('return',
                                result);case 7:case 'end':return _context7.stop();}}}, _callee7, this);}));function destroy(_x7) {return _ref14.apply(this, arguments);}return destroy;}() }, { key: 'run', value: function () {var _ref16 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(_ref15) {var


                sessionToken = _ref15.sessionToken,functionName = _ref15.functionName,keys = _ref15.keys;var url, request, result;return regeneratorRuntime.wrap(function _callee8$(_context8) {while (1) {switch (_context8.prev = _context8.next) {case 0:
                                // Prepare url
                                url = this._serverURL + '/functions/' + functionName;

                                // Run function
                                request = this._send(url, 'POST', sessionToken, keys);_context8.next = 4;return (
                                    this._queue.push(request));case 4:result = _context8.sent;return _context8.abrupt('return',
                                result);case 6:case 'end':return _context8.stop();}}}, _callee8, this);}));function run(_x8) {return _ref16.apply(this, arguments);}return run;}() }, { key: '_send', value: function () {var _ref17 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9(


            url, method, sessionToken, body) {var headers, fetchOptions, result, response;return regeneratorRuntime.wrap(function _callee9$(_context9) {while (1) {switch (_context9.prev = _context9.next) {case 0:
                                // Prepare headers
                                headers = new Headers();
                                headers.append('X-Warp-API-Key', this._apiKey);
                                headers.append('Content-Type', method === 'GET' ? 'application/x-www-form-urlencode' : 'application/json');

                                // Check if master key is provided
                                if (typeof this._masterKey === 'string') headers.append('X-Warp-Master-Key', this._masterKey);

                                // Check if session token is provided
                                if (typeof sessionToken === 'string') headers.append('X-Warp-Session-Token', sessionToken);

                                // Prepare fetch options
                                fetchOptions = {
                                    headers: headers,
                                    method: method,
                                    body: body ? JSON.stringify(body) : undefined };


                                // Fetch result
                                _context9.next = 8;return fetch(url, fetchOptions);case 8:result = _context9.sent;_context9.next = 11;return (


                                    result.json());case 11:response = _context9.sent;if (!(


                                result.status < 200 || result.status >= 400)) {_context9.next = 16;break;}throw (
                                    new _error2.default(response.code, response.message));case 16:return _context9.abrupt('return',

                                response.result);case 17:case 'end':return _context9.stop();}}}, _callee9, this);}));function _send(_x9, _x10, _x11, _x12) {return _ref17.apply(this, arguments);}return _send;}() }]);return BrowserHttpAdapter;}();exports.default = BrowserHttpAdapter;