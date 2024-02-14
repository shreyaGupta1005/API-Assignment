"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fill = exports.fillBySchema = void 0;
var ramda_1 = require("ramda");
var api_1 = require("./api");
exports.fillBySchema = (0, ramda_1.curry)(function (schema, object) {
    schema = schema.properties || (schema.schema || schema.items).properties;
    var objectProps = (0, ramda_1.keys)(object);
    var schemaProps = (0, ramda_1.keys)(schema);
    var missingProperties = (0, ramda_1.difference)(schemaProps, objectProps);
    var filledObject = (0, ramda_1.reduce)(function (result, key) {
        var _a;
        var property = schema[key];
        if ('defaultValue' in property) {
            var value = property.defaultValue;
            return __assign(__assign({}, result), (_a = {}, _a[key] = value, _a));
        }
        else {
            throw new Error("Do not know how to get default value for property \"".concat(key, "\""));
        }
    }, object, missingProperties);
    return filledObject;
});
var fillObject = function (schemas, schemaName, version, object) {
    var schema = (0, api_1.getObjectSchema)(schemas, schemaName, version);
    if (!schema) {
        throw new Error("Could not find schema ".concat(schemaName, "@").concat(version, " to trim an object"));
    }
    if (!object) {
        throw new Error('Expected an object to trim');
    }
    return (0, exports.fillBySchema)(schema, object);
};
exports.fill = (0, ramda_1.curry)(fillObject);
//# sourceMappingURL=fill.js.map