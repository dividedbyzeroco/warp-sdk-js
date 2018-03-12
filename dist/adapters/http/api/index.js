'use strict';Object.defineProperty(exports, "__esModule", { value: true });var _createClass = function () {function defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}return function (Constructor, protoProps, staticProps) {if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;};}();
/**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  * References
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  */
var _error = require('../../../utils/error');var _error2 = _interopRequireDefault(_error);
var _constants = require('../../../utils/constants');function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}function _asyncToGenerator(fn) {return function () {var gen = fn.apply(this, arguments);return new Promise(function (resolve, reject) {function step(key, arg) {try {var info = gen[key](arg);var value = info.value;} catch (error) {reject(error);return;}if (info.done) {resolve(value);} else {return Promise.resolve(value).then(function (value) {step("next", value);}, function (err) {step("throw", err);});}}return step("next");});};}function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}var













APIHttpAdapter = function () {



    function APIHttpAdapter(config) {_classCallCheck(this, APIHttpAdapter);
        // Get params
        var api = config.api;

        if (typeof api === 'undefined')
        throw new _error2.default(_error2.default.Code.MissingConfiguration, '`api` must be provided for the api platform');

        // Set controller
        this._api = api;
    }_createClass(APIHttpAdapter, [{ key: 'logIn', value: function () {var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(_ref) {var

                username = _ref.username,email = _ref.email,password = _ref.password;var result;return regeneratorRuntime.wrap(function _callee$(_context) {while (1) {switch (_context.prev = _context.next) {case 0:_context.next = 2;return (

                                    this._api.userController.logIn({ username: username, email: email, password: password }));case 2:result = _context.sent.toJSON();return _context.abrupt('return',


                                result);case 4:case 'end':return _context.stop();}}}, _callee, this);}));function logIn(_x) {return _ref2.apply(this, arguments);}return logIn;}() }, { key: 'become', value: function () {var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(_ref3) {var


                sessionToken = _ref3.sessionToken;var currentUser, result;return regeneratorRuntime.wrap(function _callee2$(_context2) {while (1) {switch (_context2.prev = _context2.next) {case 0:
                                // Get current user
                                currentUser = this._getCurrentUser(sessionToken);

                                // Fetch current user
                                _context2.next = 3;return this._api.userController.me({ currentUser: currentUser });case 3:result = _context2.sent.toJSON();return _context2.abrupt('return',


                                result);case 5:case 'end':return _context2.stop();}}}, _callee2, this);}));function become(_x2) {return _ref4.apply(this, arguments);}return become;}() }, { key: 'logOut', value: function () {var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(_ref5) {var


                sessionToken = _ref5.sessionToken;var currentUser, result;return regeneratorRuntime.wrap(function _callee3$(_context3) {while (1) {switch (_context3.prev = _context3.next) {case 0:
                                // Get current user
                                currentUser = this._getCurrentUser(sessionToken);

                                // Log out
                                _context3.next = 3;return this._api.userController.logOut({ currentUser: currentUser });case 3:result = _context3.sent.toJSON();return _context3.abrupt('return',


                                result);case 5:case 'end':return _context3.stop();}}}, _callee3, this);}));function logOut(_x3) {return _ref6.apply(this, arguments);}return logOut;}() }, { key: 'find', value: function () {var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(_ref7) {var



                className = _ref7.className,
                select = _ref7.select,
                include = _ref7.include,
                where = _ref7.where,
                sort = _ref7.sort,
                skip = _ref7.skip,
                limit = _ref7.limit;var result;return regeneratorRuntime.wrap(function _callee4$(_context4) {while (1) {switch (_context4.prev = _context4.next) {case 0:

                                // Fetch objects
                                result = void 0;if (!(
                                className === _constants.InternalKeys.Auth.User)) {_context4.next = 7;break;}_context4.next = 4;return (
                                    this._api.userController.find({ select: select, include: include, where: where, sort: sort, skip: skip, limit: limit }));case 4:result = _context4.sent.toJSON();_context4.next = 16;break;case 7:if (!(
                                className === _constants.InternalKeys.Auth.Session)) {_context4.next = 13;break;}_context4.next = 10;return (
                                    this._api.sessionController.find({ select: select, include: include, where: where, sort: sort, skip: skip, limit: limit }));case 10:result = _context4.sent.toJSON();_context4.next = 16;break;case 13:_context4.next = 15;return (

                                    this._api.classController.find({ className: className, select: select, include: include, where: where, sort: sort, skip: skip, limit: limit }));case 15:result = _context4.sent.toJSON();case 16:return _context4.abrupt('return',


                                result);case 17:case 'end':return _context4.stop();}}}, _callee4, this);}));function find(_x4) {return _ref8.apply(this, arguments);}return find;}() }, { key: 'get', value: function () {var _ref10 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(_ref9) {var


                className = _ref9.className,id = _ref9.id,select = _ref9.select,include = _ref9.include;var result;return regeneratorRuntime.wrap(function _callee5$(_context5) {while (1) {switch (_context5.prev = _context5.next) {case 0:
                                // Get object
                                result = void 0;if (!(
                                className === _constants.InternalKeys.Auth.User)) {_context5.next = 7;break;}_context5.next = 4;return (
                                    this._api.userController.get({ select: select, include: include, id: id }));case 4:result = _context5.sent.toJSON();_context5.next = 16;break;case 7:if (!(
                                className === _constants.InternalKeys.Auth.Session)) {_context5.next = 13;break;}_context5.next = 10;return (
                                    this._api.sessionController.get({ select: select, include: include, id: id }));case 10:result = _context5.sent.toJSON();_context5.next = 16;break;case 13:_context5.next = 15;return (

                                    this._api.classController.get({ className: className, select: select, include: include, id: id }));case 15:result = _context5.sent.toJSON();case 16:return _context5.abrupt('return',


                                result);case 17:case 'end':return _context5.stop();}}}, _callee5, this);}));function get(_x5) {return _ref10.apply(this, arguments);}return get;}() }, { key: 'save', value: function () {var _ref12 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(_ref11) {var


                sessionToken = _ref11.sessionToken,className = _ref11.className,keys = _ref11.keys,id = _ref11.id;var currentUser, result;return regeneratorRuntime.wrap(function _callee6$(_context6) {while (1) {switch (_context6.prev = _context6.next) {case 0:
                                // Get current user
                                currentUser = this._getCurrentUser(sessionToken);

                                // Save objects
                                result = void 0;if (!(

                                typeof id === 'undefined')) {_context6.next = 14;break;}if (!(
                                className === _constants.InternalKeys.Auth.User)) {_context6.next = 9;break;}_context6.next = 6;return (
                                    this._api.userController.create({ currentUser: currentUser, keys: keys }));case 6:result = _context6.sent.toJSON();_context6.next = 12;break;case 9:_context6.next = 11;return (

                                    this._api.classController.create({ currentUser: currentUser, className: className, keys: keys }));case 11:result = _context6.sent.toJSON();case 12:_context6.next = 23;break;case 14:if (!(


                                className === _constants.InternalKeys.Auth.User)) {_context6.next = 20;break;}_context6.next = 17;return (
                                    this._api.userController.update({ currentUser: currentUser, keys: keys, id: id }));case 17:result = _context6.sent.toJSON();_context6.next = 23;break;case 20:_context6.next = 22;return (

                                    this._api.classController.update({ currentUser: currentUser, className: className, keys: keys, id: id }));case 22:result = _context6.sent.toJSON();case 23:return _context6.abrupt('return',


                                result);case 24:case 'end':return _context6.stop();}}}, _callee6, this);}));function save(_x6) {return _ref12.apply(this, arguments);}return save;}() }, { key: 'destroy', value: function () {var _ref14 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(_ref13) {var


                sessionToken = _ref13.sessionToken,className = _ref13.className,id = _ref13.id;var currentUser, result;return regeneratorRuntime.wrap(function _callee7$(_context7) {while (1) {switch (_context7.prev = _context7.next) {case 0:
                                // Get current user
                                currentUser = this._getCurrentUser(sessionToken);

                                // Destroy object
                                result = void 0;if (!(
                                className === _constants.InternalKeys.Auth.User)) {_context7.next = 8;break;}_context7.next = 5;return (
                                    this._api.userController.destroy({ currentUser: currentUser, id: id }));case 5:result = _context7.sent.toJSON();_context7.next = 11;break;case 8:_context7.next = 10;return (

                                    this._api.classController.destroy({ currentUser: currentUser, className: className, id: id }));case 10:result = _context7.sent.toJSON();case 11:return _context7.abrupt('return',


                                result);case 12:case 'end':return _context7.stop();}}}, _callee7, this);}));function destroy(_x7) {return _ref14.apply(this, arguments);}return destroy;}() }, { key: 'run', value: function () {var _ref16 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(_ref15) {var


                sessionToken = _ref15.sessionToken,functionName = _ref15.functionName,keys = _ref15.keys;var currentUser, result;return regeneratorRuntime.wrap(function _callee8$(_context8) {while (1) {switch (_context8.prev = _context8.next) {case 0:
                                // Get current user
                                currentUser = this._getCurrentUser(sessionToken);

                                // Destroy object
                                _context8.next = 3;return this._api.functionController.run({ currentUser: currentUser, functionName: functionName, keys: keys });case 3:result = _context8.sent.toJSON();return _context8.abrupt('return',


                                result);case 5:case 'end':return _context8.stop();}}}, _callee8, this);}));function run(_x8) {return _ref16.apply(this, arguments);}return run;}() }, { key: '_getCurrentUser', value: function () {var _ref17 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9(


            sessionToken) {var user;return regeneratorRuntime.wrap(function _callee9$(_context9) {while (1) {switch (_context9.prev = _context9.next) {case 0:_context9.next = 2;return (
                                    this._api.authenticate({ sessionToken: sessionToken }));case 2:user = _context9.sent;return _context9.abrupt('return',
                                user);case 4:case 'end':return _context9.stop();}}}, _callee9, this);}));function _getCurrentUser(_x9) {return _ref17.apply(this, arguments);}return _getCurrentUser;}() }]);return APIHttpAdapter;}();exports.default = APIHttpAdapter;