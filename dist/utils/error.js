'use strict';Object.defineProperty(exports, "__esModule", { value: true });var _createClass = function () {function defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}return function (Constructor, protoProps, staticProps) {if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;};}();function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _possibleConstructorReturn(self, call) {if (!self) {throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return call && (typeof call === "object" || typeof call === "function") ? call : self;}function _inherits(subClass, superClass) {if (typeof superClass !== "function" && superClass !== null) {throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);}subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;}var
WarpError = function (_Error) {_inherits(WarpError, _Error);_createClass(WarpError, [{ key: 'status', get: function get()








































        {
            if (this.code === this.constructor.Code.InvalidCredentials ||
            this.code === this.constructor.Code.InvalidSessionToken ||
            this.code === this.constructor.Code.UsernameTaken ||
            this.code === this.constructor.Code.EmailTaken) {
                return this.constructor.Status.Unauthorized;
            } else
            if (this.code === this.constructor.Code.ForbiddenOperation) {
                return this.constructor.Status.Forbidden;
            } else
            if (this.code === this.constructor.Code.ModelNotFound ||
            this.code === this.constructor.Code.FunctionNotFound) {
                return this.constructor.Status.NotFound;
            } else
            if (this.code === this.constructor.Code.RequestTimeout) {
                return this.constructor.Status.RequestTimeout;
            } else
            if (this.code === this.constructor.Code.TooManyRequests) {
                return this.constructor.Status.TooManyRequests;
            } else
            {
                return this.constructor.Status.ServerError;
            }
        } }], [{ key: 'Code', /**
                               * Public properties
                               */get: function get() {return Object.freeze({ MissingConfiguration: 300, InternalServerError: 100, QueryError: 101, // Error with a database query
                InvalidCredentials: 102, // Invalid username/password
                InvalidSessionToken: 103, // Invalid session token
                InvalidObjectKey: 104, // Key validation failed
                InvalidPointer: 105, // Invalid pointer
                ForbiddenOperation: 106, // Incorrect use of API
                UsernameTaken: 107, // Username registered already exists
                EmailTaken: 108, // Email registered already exists
                InvalidAPIKey: 109, // Invalid API Key
                ModelNotFound: 110, FunctionNotFound: 111, RequestTimeout: 112, FunctionError: 113, TooManyRequests: 114, DatabaseError: 115 });} }, { key: 'Status', get: function get() {return Object.freeze({ ServerError: 400, Unauthorized: 401, Forbidden: 403, NotFound: 404, RequestTimeout: 408, TooManyRequests: 429 });} }]);function WarpError(code, message) {_classCallCheck(this, WarpError);var _this = _possibleConstructorReturn(this, (WarpError.__proto__ || Object.getPrototypeOf(WarpError)).call(this, message));_this.name = 'Warp Server Error';_this.code = code;return _this;}return WarpError;}(Error);exports.default = WarpError;