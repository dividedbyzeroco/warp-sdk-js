"use strict";Object.defineProperty(exports, "__esModule", { value: true });var toCamelCase = exports.toCamelCase = function toCamelCase(value) {
    return value.replace(/_\w/g, function (word) {return word[1].toUpperCase();});
};

var toPascalCase = exports.toPascalCase = function toPascalCase(value) {
    value = toCamelCase(value);
    value[0] = value[0].toUpperCase();
    return value;
};

var toDateTime = exports.toDateTime = function toDateTime(value) {
    if (!value) return new Date();else
    return new Date(value);
};