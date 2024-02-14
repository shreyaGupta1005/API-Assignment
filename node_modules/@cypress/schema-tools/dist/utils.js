"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.oneOfRegex = exports.combineSchemas = exports.setPackageName = exports.versionSchemas = exports.normalizeRequiredProperties = exports.normalizeName = exports.stringToSemver = exports.semverToString = void 0;
var lodash_1 = require("lodash");
var ramda_1 = require("ramda");
var semverToString = function (s) {
    return "".concat(s.major, ".").concat(s.minor, ".").concat(s.patch);
};
exports.semverToString = semverToString;
var stringToSemver = function (s) {
    var _a = s.split('.'), major = _a[0], minor = _a[1], patch = _a[2];
    return {
        major: parseInt(major),
        minor: parseInt(minor),
        patch: parseInt(patch),
    };
};
exports.stringToSemver = stringToSemver;
var normalizeName = function (s) { return (0, lodash_1.camelCase)(s); };
exports.normalizeName = normalizeName;
var normalizeRequiredProperties = function (schema) {
    if (schema.required === true) {
        if (schema.properties) {
            var reducer = function (memo, obj, key) {
                if (obj.required !== false) {
                    memo.push(key);
                }
                return memo;
            };
            schema.required = (0, lodash_1.reduce)(schema.properties, reducer, []);
        }
        else {
            schema.required = [];
        }
    }
    return schema;
};
exports.normalizeRequiredProperties = normalizeRequiredProperties;
var versionSchemas = function () {
    var schemas = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        schemas[_i] = arguments[_i];
    }
    if (!schemas.length) {
        throw new Error('expected list of schemas');
    }
    var titles = (0, ramda_1.map)((0, ramda_1.path)(['schema', 'title']))(schemas);
    var unique = (0, ramda_1.uniq)(titles);
    if (unique.length !== 1) {
        throw new Error("expected same schema titles, got ".concat(titles.join(', ')));
    }
    var result = {};
    schemas.forEach(function (s) {
        (0, exports.normalizeRequiredProperties)(s.schema);
        var version = (0, exports.semverToString)(s.version);
        result[version] = s;
    });
    return result;
};
exports.versionSchemas = versionSchemas;
var setPackageName = function (schemas, packageName) {
    Object.keys(schemas).forEach(function (name) {
        Object.keys(schemas[name]).forEach(function (version) {
            var schema = schemas[name][version];
            if (!schema.package) {
                schema.package = packageName;
            }
        });
    });
    return schemas;
};
exports.setPackageName = setPackageName;
var combineSchemas = function () {
    var versioned = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        versioned[_i] = arguments[_i];
    }
    var result = {};
    versioned.forEach(function (v) {
        var title = v[Object.keys(v)[0]].schema.title;
        var name = (0, exports.normalizeName)(title);
        result[name] = v;
    });
    return result;
};
exports.combineSchemas = combineSchemas;
var oneOfRegex = function () {
    var values = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        values[_i] = arguments[_i];
    }
    return new RegExp("^(".concat(values.join('|'), ")$"));
};
exports.oneOfRegex = oneOfRegex;
//# sourceMappingURL=utils.js.map