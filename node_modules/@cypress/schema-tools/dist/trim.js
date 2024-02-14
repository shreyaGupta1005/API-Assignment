"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.trim = exports.trimBySchema = void 0;
var ramda_1 = require("ramda");
var api_1 = require("./api");
var sanitize_1 = require("./sanitize");
exports.trimBySchema = (0, ramda_1.curry)(function (schema, object) {
    schema = schema.properties || (schema.schema || schema.items).properties;
    var objectProps = (0, ramda_1.keys)(object);
    var schemaProps = (0, ramda_1.keys)(schema);
    return (0, ramda_1.reduce)(function (trimmedObj, prop) {
        if ((0, ramda_1.contains)(prop, schemaProps)) {
            if (object[prop] && (0, sanitize_1.isJsonSchema)(schema[prop])) {
                trimmedObj[prop] = (0, exports.trimBySchema)(schema[prop], object[prop]);
            }
            else if (object[prop] && (0, sanitize_1.hasPropertiesArray)(schema[prop])) {
                trimmedObj[prop] = (0, ramda_1.map)((0, exports.trimBySchema)(schema[prop]), object[prop]);
            }
            else {
                trimmedObj[prop] = object[prop];
            }
        }
        return trimmedObj;
    }, {}, objectProps);
});
var trimObject = function (schemas, schemaName, version, object) {
    var schema = (0, api_1.getObjectSchema)(schemas, schemaName, version);
    if (!schema) {
        throw new Error("Could not find schema ".concat(schemaName, "@").concat(version, " to trim an object"));
    }
    if (!object) {
        throw new Error('Expected an object to trim');
    }
    return (0, exports.trimBySchema)(schema, object);
};
exports.trim = (0, ramda_1.curry)(trimObject);
//# sourceMappingURL=trim.js.map