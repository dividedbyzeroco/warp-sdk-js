'use strict';Object.defineProperty(exports, "__esModule", { value: true });var _createClass = function () {function defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}return function (Constructor, protoProps, staticProps) {if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;};}();
/**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  * References
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  */
var _error = require('./error');var _error2 = _interopRequireDefault(_error);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}function _asyncToGenerator(fn) {return function () {var gen = fn.apply(this, arguments);return new Promise(function (resolve, reject) {function step(key, arg) {try {var info = gen[key](arg);var value = info.value;} catch (error) {reject(error);return;}if (info.done) {resolve(value);} else {return Promise.resolve(value).then(function (value) {step("next", value);}, function (err) {step("throw", err);});}}return step("next");});};}function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}var

Queue = function () {






    function Queue(maxRequests, requestInterval, timeout) {_classCallCheck(this, Queue);this._requestInterval = 200;this._requests = 0;
        this._maxRequests = maxRequests;
        this._requestInterval = requestInterval;
        this._timeout = timeout;
    } // milliseconds
    _createClass(Queue, [{ key: '_sleep', value: function _sleep()
        {var _this = this;
            return new Promise(function (resolve) {return setTimeout(resolve, _this._requestInterval);});
        } }, { key: 'push', value: function () {var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(

            request) {var _this2 = this;return regeneratorRuntime.wrap(function _callee$(_context) {while (1) {switch (_context.prev = _context.next) {case 0:if (!(


                                this._requests >= this._maxRequests)) {_context.next = 5;break;}_context.next = 3;return this._sleep();case 3:_context.next = 0;break;case 5:

                                // Increase number of requests
                                this._requests++;_context.next = 8;return (

                                    new Promise(function (resolve, reject) {
                                        // Prepare timeout and finish flags
                                        var hasTimedOut = false;
                                        var hasFinished = false;

                                        // Execute the request
                                        request.then(function (result) {
                                            // If it has not yet timed out, resolve
                                            if (!hasTimedOut) {
                                                // Set has finished to true
                                                hasFinished = true;

                                                // Decrease number of requests
                                                _this2._requests--;

                                                return resolve(result);
                                            }
                                        }).
                                        catch(function (err) {
                                            // Check if it has timed out
                                            if (hasTimedOut) return;

                                            // Decrease number of requests
                                            _this2._requests--;

                                            // Catch error
                                            hasFinished = true;
                                            reject(err);
                                        });

                                        // Prepare timer
                                        setTimeout(function () {
                                            // Check if it has finished
                                            if (hasFinished) return;

                                            // Change timeout indicator
                                            hasTimedOut = true;

                                            // Return an error
                                            reject(new _error2.default(_error2.default.Code.InternalServerError, 'Request timed out'));
                                        }, _this2._timeout * 1000);
                                    }));case 8:return _context.abrupt('return', _context.sent);case 9:case 'end':return _context.stop();}}}, _callee, this);}));function push(_x) {return _ref.apply(this, arguments);}return push;}() }]);return Queue;}();exports.default = Queue;