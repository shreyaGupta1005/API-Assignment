"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addProperty = exports.extend = void 0;
var ramda_1 = require("ramda");
var utils_1 = require("./utils");
var addProperty = function (from) {
    var newProperties = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        newProperties[_i - 1] = arguments[_i];
    }
    var newSchema = (0, ramda_1.clone)(from.schema);
    newSchema.schema.description = from.description;
    if (from.title) {
        newSchema.schema.title = from.title;
    }
    else {
        newSchema.version.minor += 1;
    }
    if (!newSchema.schema.properties) {
        newSchema.schema.properties = {};
    }
    newProperties.forEach(function (options) {
        var newProperties = newSchema.schema.properties;
        newProperties[options.property] = {
            type: options.propertyType,
        };
        var newProp = newProperties[options.property];
        if (options.propertyFormat) {
            newProp.format = options.propertyFormat;
        }
        (0, utils_1.normalizeRequiredProperties)(newSchema.schema);
        var required = newSchema.schema.required;
        if (options.isRequired) {
            required.push(options.property);
        }
        else {
            newSchema.schema.required = (0, ramda_1.reject)((0, ramda_1.equals)(options.property), required);
        }
        if (options.propertyDescription) {
            newProp.description = options.propertyDescription;
        }
        if (options.see) {
            newProp.see = options.see;
        }
        if ('defaultValue' in options) {
            newProp.defaultValue = options.defaultValue;
        }
        newSchema.example[options.property] = (0, ramda_1.clone)(options.exampleValue);
    });
    return newSchema;
};
exports.addProperty = addProperty;
var extend = function (from, schemaObj) {
    var newSchema = (0, ramda_1.mergeDeepRight)((0, ramda_1.clone)(from), schemaObj);
    if (!(0, ramda_1.equals)(schemaObj.version, newSchema.version)) {
        newSchema.version.minor += 1;
    }
    (0, utils_1.normalizeRequiredProperties)(newSchema.schema);
    return newSchema;
};
exports.extend = extend;
//# sourceMappingURL=actions.js.map