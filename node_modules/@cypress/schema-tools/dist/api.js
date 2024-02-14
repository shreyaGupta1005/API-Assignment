"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bind = exports.assertSchema = exports.assertBySchema = exports.SchemaError = exports.validate = exports.validateBySchema = exports.getExample = exports.getSchemaVersions = exports.schemaNames = exports.hasSchema = exports.getObjectSchema = exports.getVersionedSchema = void 0;
var is_my_json_valid_1 = __importDefault(require("is-my-json-valid"));
var debug_1 = __importDefault(require("debug"));
var json_stable_stringify_1 = __importDefault(require("json-stable-stringify"));
var lodash_1 = require("lodash");
var ramda_1 = require("ramda");
var fill_1 = require("./fill");
var formats_1 = require("./formats");
var sanitize_1 = require("./sanitize");
var trim_1 = require("./trim");
var utils = __importStar(require("./utils"));
var debug = (0, debug_1.default)('schema-tools');
var getVersionedSchema = function (schemas) { return function (name) {
    name = utils.normalizeName(name);
    return schemas[name];
}; };
exports.getVersionedSchema = getVersionedSchema;
var _getObjectSchema = function (schemas, schemaName, version) {
    schemaName = utils.normalizeName(schemaName);
    var namedSchemas = schemas[schemaName];
    if (!namedSchemas) {
        debug('missing schema %s', schemaName);
        return;
    }
    return namedSchemas[version];
};
exports.getObjectSchema = (0, ramda_1.curry)(_getObjectSchema);
var _hasSchema = function (schemas, schemaName, version) { return Boolean(_getObjectSchema(schemas, schemaName, version)); };
exports.hasSchema = (0, ramda_1.curry)(_hasSchema);
var schemaNames = function (schemas) {
    return Object.keys(schemas).sort();
};
exports.schemaNames = schemaNames;
var getSchemaVersions = function (schemas) { return function (schemaName) {
    schemaName = utils.normalizeName(schemaName);
    if (schemas[schemaName]) {
        return Object.keys(schemas[schemaName]);
    }
    return [];
}; };
exports.getSchemaVersions = getSchemaVersions;
exports.getExample = (0, ramda_1.curry)(function (schemas, schemaName, version) {
    var o = (0, exports.getObjectSchema)(schemas)(schemaName)(version);
    if (!o) {
        debug('could not find object schema %s@%s', schemaName, version);
        return;
    }
    return o.example;
});
var dataHasAdditionalPropertiesValidationError = {
    field: 'data',
    message: 'has additional properties',
};
var findDataHasAdditionalProperties = (0, ramda_1.find)((0, ramda_1.whereEq)(dataHasAdditionalPropertiesValidationError));
var includesDataHasAdditionalPropertiesError = function (errors) { return findDataHasAdditionalProperties(errors) !== undefined; };
var errorToString = function (error) {
    return "".concat(error.field, " ").concat(error.message);
};
var errorsToStrings = function (errors) {
    return errors.map(errorToString);
};
var validateBySchema = function (schema, formats, greedy) {
    if (greedy === void 0) { greedy = true; }
    return function (object) {
        var validate = (0, is_my_json_valid_1.default)(schema, { formats: formats, greedy: greedy });
        if (validate(object)) {
            return true;
        }
        var uniqueErrors = (0, ramda_1.uniqBy)(errorToString, validate.errors);
        if (includesDataHasAdditionalPropertiesError(uniqueErrors) &&
            (0, ramda_1.keys)(schema.properties).length) {
            var hasData = findDataHasAdditionalProperties(uniqueErrors);
            var additionalProperties = (0, ramda_1.difference)((0, ramda_1.keys)(object), (0, ramda_1.keys)(schema.properties));
            hasData.message += ': ' + additionalProperties.join(', ');
        }
        var errors = (0, ramda_1.uniq)(errorsToStrings(uniqueErrors));
        return errors;
    };
};
exports.validateBySchema = validateBySchema;
var validate = function (schemas, formats, greedy) {
    if (greedy === void 0) { greedy = true; }
    return function (schemaName, version) {
        return function (object) {
            schemaName = utils.normalizeName(schemaName);
            var namedSchemas = schemas[schemaName];
            if (!namedSchemas) {
                return ["Missing schema ".concat(schemaName)];
            }
            var aSchema = namedSchemas[version];
            if (!aSchema) {
                return ["Missing schema ".concat(schemaName, "@").concat(version)];
            }
            return (0, exports.validateBySchema)(aSchema.schema, formats, greedy)(object);
        };
    };
};
exports.validate = validate;
var SchemaError = (function (_super) {
    __extends(SchemaError, _super);
    function SchemaError(message, errors, object, example, schemaName, schemaVersion) {
        var _newTarget = this.constructor;
        var _this = _super.call(this, message) || this;
        Object.setPrototypeOf(_this, _newTarget.prototype);
        _this.errors = errors;
        _this.object = object;
        _this.example = example;
        _this.schemaName = schemaName;
        if (schemaVersion) {
            _this.schemaVersion = schemaVersion;
        }
        return _this;
    }
    return SchemaError;
}(Error));
exports.SchemaError = SchemaError;
var AssertBySchemaDefaults = {
    greedy: true,
    substitutions: [],
    omit: {
        errors: false,
        object: false,
        example: false,
    },
};
var assertBySchema = function (schema, example, options, label, formats, schemaVersion) {
    if (example === void 0) { example = {}; }
    return function (object) {
        var allOptions = (0, ramda_1.mergeDeepLeft)(options || AssertBySchemaDefaults, AssertBySchemaDefaults);
        var replace = function () {
            var cloned = (0, ramda_1.clone)(object);
            allOptions.substitutions.forEach(function (property) {
                var value = (0, lodash_1.get)(example, property);
                (0, lodash_1.set)(cloned, property, value);
            });
            return cloned;
        };
        var replaced = allOptions.substitutions.length ? replace() : object;
        var result = (0, exports.validateBySchema)(schema, formats, allOptions.greedy)(replaced);
        if (result === true) {
            return object;
        }
        var title = label ? "Schema ".concat(label, " violated") : 'Schema violated';
        var emptyLine = '';
        var parts = [title];
        if (!allOptions.omit.errors) {
            parts = parts.concat([emptyLine, 'Errors:']).concat(result);
        }
        if (!allOptions.omit.object) {
            var objectString = (0, json_stable_stringify_1.default)(replaced, { space: '  ' });
            parts = parts.concat([emptyLine, 'Current object:', objectString]);
        }
        if (!allOptions.omit.example) {
            var exampleString = (0, json_stable_stringify_1.default)(example, { space: '  ' });
            parts = parts.concat([
                emptyLine,
                'Expected object like this:',
                exampleString,
            ]);
        }
        var message = parts.join('\n');
        throw new SchemaError(message, result, replaced, example, schema.title, schemaVersion);
    };
};
exports.assertBySchema = assertBySchema;
var assertSchema = function (schemas, formats) {
    return function (name, version, options) {
        return function (object) {
            var example = (0, exports.getExample)(schemas)(name)(version);
            var schema = (0, exports.getObjectSchema)(schemas)(name)(version);
            if (!schema) {
                throw new Error("Could not find schema ".concat(name, "@").concat(version));
            }
            var label = "".concat(name, "@").concat(version);
            return (0, exports.assertBySchema)(schema.schema, example, options, label, formats, utils.semverToString(schema.version))(object);
        };
    };
};
exports.assertSchema = assertSchema;
var mergeSchemas = function (schemas) {
    return (0, ramda_1.mergeAll)(schemas);
};
var mergeFormats = function (formats) {
    return (0, ramda_1.mergeAll)(formats);
};
var exists = function (x) { return Boolean(x); };
var bind = function () {
    var options = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        options[_i] = arguments[_i];
    }
    var allSchemas = (0, ramda_1.map)((0, ramda_1.prop)('schemas'), options);
    var schemas = mergeSchemas(allSchemas);
    var allFormats = (0, ramda_1.filter)(exists, (0, ramda_1.map)((0, ramda_1.prop)('formats'), options));
    var formats = mergeFormats(allFormats);
    var formatDetectors = (0, formats_1.detectors)(formats);
    var defaults = (0, formats_1.getDefaults)(formats);
    var api = {
        assertSchema: (0, exports.assertSchema)(schemas, formatDetectors),
        schemaNames: (0, exports.schemaNames)(schemas),
        getExample: (0, exports.getExample)(schemas),
        sanitize: (0, sanitize_1.sanitize)(schemas, defaults),
        validate: (0, exports.validate)(schemas),
        trim: (0, trim_1.trim)(schemas),
        hasSchema: (0, exports.hasSchema)(schemas),
        fill: (0, fill_1.fill)(schemas),
    };
    return api;
};
exports.bind = bind;
//# sourceMappingURL=api.js.map