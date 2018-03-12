'use strict';Object.defineProperty(exports, "__esModule", { value: true });var _createClass = function () {function defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}return function (Constructor, protoProps, staticProps) {if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;};}();
/**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  * References
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  */
var _object5 = require('../classes/object');var _object6 = _interopRequireDefault(_object5);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}function _asyncToGenerator(fn) {return function () {var gen = fn.apply(this, arguments);return new Promise(function (resolve, reject) {function step(key, arg) {try {var info = gen[key](arg);var value = info.value;} catch (error) {reject(error);return;}if (info.done) {resolve(value);} else {return Promise.resolve(value).then(function (value) {step("next", value);}, function (err) {step("throw", err);});}}return step("next");});};}function _toConsumableArray(arr) {if (Array.isArray(arr)) {for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {arr2[i] = arr[i];}return arr2;} else {return Array.from(arr);}}function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}var

Collection = function () {



    function Collection(objects) {_classCallCheck(this, Collection);
        this._objects = objects;
    }_createClass(Collection, [{ key: 'count', value: function count()





        {
            return this._objects.length;
        }

        /**
           * Get the first item from the collection
           */ }, { key: 'first', value: function first()
        {
            return this._objects.length > 0 ? this._objects[0] : null;
        }

        /**
           * Get the last Object from the collection
           */ }, { key: 'last', value: function last()
        {
            return this._objects.length > 0 ? this._objects[this._objects.length - 1] : null;
        }

        /**
           * Return Objects that pass a given evaluator
           * @param {Function} evaluator 
           */ }, { key: 'where', value: function where(
        evaluator) {
            var objects = [].concat(_toConsumableArray(this._objects));
            var map = [];var _iteratorNormalCompletion = true;var _didIteratorError = false;var _iteratorError = undefined;try {

                for (var _iterator = objects[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {var _object = _step.value;
                    if (evaluator(_object)) {
                        map.push(_object);
                    }
                }} catch (err) {_didIteratorError = true;_iteratorError = err;} finally {try {if (!_iteratorNormalCompletion && _iterator.return) {_iterator.return();}} finally {if (_didIteratorError) {throw _iteratorError;}}}

            var constructor = this.constructor;
            return new constructor(map);
        }

        /**
           * Map Objects into an array using an iterator
           * @param {Function} iterator 
           */ }, { key: 'map', value: function map(
        iterator) {
            var objects = [].concat(_toConsumableArray(this._objects));
            var map = [];var _iteratorNormalCompletion2 = true;var _didIteratorError2 = false;var _iteratorError2 = undefined;try {

                for (var _iterator2 = objects[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {var _object2 = _step2.value;
                    map.push(iterator(_object2));
                }} catch (err) {_didIteratorError2 = true;_iteratorError2 = err;} finally {try {if (!_iteratorNormalCompletion2 && _iterator2.return) {_iterator2.return();}} finally {if (_didIteratorError2) {throw _iteratorError2;}}}

            return map;
        }

        /**
           * Iterate through each item
           * @param {Function} iterator 
           */ }, { key: 'forEach', value: function forEach(
        iterator) {
            var objects = [].concat(_toConsumableArray(this._objects));var _iteratorNormalCompletion3 = true;var _didIteratorError3 = false;var _iteratorError3 = undefined;try {

                for (var _iterator3 = objects[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {var _object3 = _step3.value;
                    iterator(_object3);
                }} catch (err) {_didIteratorError3 = true;_iteratorError3 = err;} finally {try {if (!_iteratorNormalCompletion3 && _iterator3.return) {_iterator3.return();}} finally {if (_didIteratorError3) {throw _iteratorError3;}}}
        }

        /**
           * Alias of toArray()
           */ }, { key: 'toList', value: function toList()
        {
            return this.toArray();
        }

        /**
           * Convert the collection into an array
           */ }, { key: 'toArray', value: function toArray()
        {
            return this.map(function (object) {return object;});
        }

        /**
           * Run a promise iterator over every Object, in series
           * @param {Function} iterator
           */ }, { key: 'each', value: function () {var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(
            iterator) {var objects, _iteratorNormalCompletion4, _didIteratorError4, _iteratorError4, _iterator4, _step4, _object4;return regeneratorRuntime.wrap(function _callee$(_context) {while (1) {switch (_context.prev = _context.next) {case 0:
                                // Get objects
                                objects = [].concat(_toConsumableArray(this._objects));_iteratorNormalCompletion4 = true;_didIteratorError4 = false;_iteratorError4 = undefined;_context.prev = 4;_iterator4 =

                                objects[Symbol.iterator]();case 6:if (_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done) {_context.next = 13;break;}_object4 = _step4.value;_context.next = 10;return (
                                    iterator(_object4));case 10:_iteratorNormalCompletion4 = true;_context.next = 6;break;case 13:_context.next = 19;break;case 15:_context.prev = 15;_context.t0 = _context['catch'](4);_didIteratorError4 = true;_iteratorError4 = _context.t0;case 19:_context.prev = 19;_context.prev = 20;if (!_iteratorNormalCompletion4 && _iterator4.return) {_iterator4.return();}case 22:_context.prev = 22;if (!_didIteratorError4) {_context.next = 25;break;}throw _iteratorError4;case 25:return _context.finish(22);case 26:return _context.finish(19);case 27:return _context.abrupt('return');case 28:case 'end':return _context.stop();}}}, _callee, this, [[4, 15, 19, 27], [20,, 22, 26]]);}));function each(_x) {return _ref.apply(this, arguments);}return each;}()





        /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           * Run a promise iterator over every Object, in parallel
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           */ }, { key: 'all', value: function () {var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(
            iterator) {var iterators;return regeneratorRuntime.wrap(function _callee2$(_context2) {while (1) {switch (_context2.prev = _context2.next) {case 0:
                                // Define iterators
                                iterators = this.map(function (object) {return iterator(object);});_context2.next = 3;return (

                                    Promise.all(iterators));case 3:return _context2.abrupt('return');case 4:case 'end':return _context2.stop();}}}, _callee2, this);}));function all(_x2) {return _ref2.apply(this, arguments);}return all;}()



        // $FlowFixMe
    }, { key: Symbol.iterator, value: function value() {var _this = this;
            var _index = 0;

            return {
                next: function next() {
                    if (_index < _this.length) {
                        return { value: _this._objects[_index++], done: false };
                    } else
                    {
                        _index = 0;
                        return { done: true };
                    }
                } };

        } }, { key: 'length', get: function get() {return this.count();} }]);return Collection;}();exports.default = Collection;