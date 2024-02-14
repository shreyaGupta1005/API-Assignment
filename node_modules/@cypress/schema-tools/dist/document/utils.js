"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.documentObjectSchema = exports.documentSchema = exports.documentProperties = exports.documentProperty = exports.findUsedColumns = exports.formatToMarkdown = exports.enumToMarkdown = exports.anchorForSchema = exports.anchor = exports.emptyMark = exports.checkMark = void 0;
var json_stable_stringify_1 = __importDefault(require("json-stable-stringify"));
var quote_1 = __importDefault(require("quote"));
var ramda_1 = require("ramda");
var __1 = require("..");
var ticks = (0, quote_1.default)({ quotes: '`' });
exports.checkMark = '✔';
exports.emptyMark = '';
var isCustomFormat = function (formats) { return function (name) { return name in formats; }; };
var knownSchemaNames = function (schemas) { return (0, __1.schemaNames)(schemas); };
var isSchemaName = function (schemas) { return function (s) {
    return knownSchemaNames(schemas).includes((0, __1.normalizeName)(s));
}; };
var anchor = function (s) { return (0, ramda_1.toLower)(s.replace(/[\.@]/g, '')); };
exports.anchor = anchor;
var anchorForSchema = function (s) {
    var schemaName = (0, ramda_1.toLower)((0, __1.normalizeName)(s.schema.title));
    var seeVersion = (0, __1.semverToString)(s.version);
    var nameAndVersion = "".concat(schemaName, "@").concat(seeVersion);
    return (0, exports.anchor)(nameAndVersion);
};
exports.anchorForSchema = anchorForSchema;
var enumToMarkdown = function (enumeration) {
    if (!enumeration) {
        return exports.emptyMark;
    }
    return ticks(enumeration.map(JSON.stringify).join(', '));
};
exports.enumToMarkdown = enumToMarkdown;
var formatToMarkdown = function (schemas, formats) {
    return function (value) {
        if (!value.format) {
            if (value.see) {
                if (typeof value.see === 'string') {
                    return schemas && isSchemaName(schemas)(value.see)
                        ? "[".concat(value.see, "](#").concat((0, ramda_1.toLower)((0, __1.normalizeName)(value.see)), ")")
                        : ticks(value.see);
                }
                else {
                    var seeSchema = value.see;
                    var schemaName = "".concat(seeSchema.schema.title);
                    var seeVersion = (0, __1.semverToString)(seeSchema.version);
                    var nameAndVersion = "".concat(schemaName, "@").concat(seeVersion);
                    var seeAnchor = (0, exports.anchorForSchema)(seeSchema);
                    return schemas && isSchemaName(schemas)(schemaName)
                        ? "[".concat(nameAndVersion, "](#").concat(seeAnchor, ")")
                        : ticks(nameAndVersion);
                }
            }
            else {
                return exports.emptyMark;
            }
        }
        if (formats && isCustomFormat(formats)(value.format)) {
            return "[".concat(value.format, "](#formats)");
        }
        return ticks(value.format);
    };
};
exports.formatToMarkdown = formatToMarkdown;
var findUsedColumns = function (headers, rows) {
    var isUsed = function (header) { return (0, ramda_1.find)(function (r) { return r[header]; }, rows); };
    var usedHeaders = headers.filter(isUsed);
    return usedHeaders;
};
exports.findUsedColumns = findUsedColumns;
var existingProp = function (name) {
    return function (o) {
        return name in o ? String(o[name]) : exports.emptyMark;
    };
};
var documentProperty = function (requiredProperties, schemas, formats) {
    return function (prop, value) {
        var isRequired = function (name) { return requiredProperties.indexOf(name) !== -1; };
        var typeText = function (type) { return (Array.isArray(type) ? type.join(' or ') : type); };
        var deprecatedMessage = function (value) {
            return value.deprecated ? "**deprecated** ".concat(value.deprecated) : exports.emptyMark;
        };
        return {
            name: ticks(prop),
            type: typeText(value.type),
            required: isRequired(prop) ? exports.checkMark : exports.emptyMark,
            format: (0, exports.formatToMarkdown)(schemas, formats)(value),
            enum: (0, exports.enumToMarkdown)(value.enum),
            description: value.description ? value.description : exports.emptyMark,
            deprecated: deprecatedMessage(value),
            minLength: existingProp('minLength')(value),
            maxLength: existingProp('maxLength')(value),
            defaultValue: existingProp('defaultValue')(value),
        };
    };
};
exports.documentProperty = documentProperty;
var documentProperties = function (properties, required, schemas, formats) {
    if (required === void 0) { required = []; }
    var requiredProperties = Array.isArray(required)
        ? required
        : Object.keys(properties);
    var docProperty = (0, exports.documentProperty)(requiredProperties, schemas, formats);
    return Object.keys(properties)
        .sort()
        .map(function (prop) {
        var value = properties[prop];
        return docProperty(prop, value);
    });
};
exports.documentProperties = documentProperties;
var documentSchema = function (schema, schemas, formats) {
    var properties = schema.properties;
    if (properties) {
        var rows = (0, exports.documentProperties)(properties, schema.required, schemas, formats);
        var headers = [
            'name',
            'type',
            'required',
            'format',
            'enum',
            'description',
            'deprecated',
            'minLength',
            'maxLength',
            'defaultValue',
        ];
        var usedHeaders = (0, exports.findUsedColumns)(headers, rows);
        var table = [
            {
                table: {
                    headers: usedHeaders,
                    rows: rows,
                },
            },
        ];
        if (schema.additionalProperties) {
            table.push({
                p: 'This schema allows additional properties.',
            });
        }
        return table;
    }
    else {
        return { p: 'Hmm, no properties found in this schema' };
    }
};
exports.documentSchema = documentSchema;
var schemaNameHeading = function (name, version) {
    return "".concat(name, "@").concat(version);
};
var documentObjectSchema = function (schema, schemas, formats) {
    var schemaName = schema.schema.title;
    if (schemaName.includes(' ')) {
        throw new Error("Schema title contains spaces \"".concat(schemaName, "\"\n      This can cause problems generating anchors!"));
    }
    var schemaVersion = (0, __1.semverToString)(schema.version);
    var start = [
        { h3: schemaNameHeading((0, __1.normalizeName)(schemaName), schemaVersion) },
    ];
    if (schema.package) {
        start.push({
            p: "Defined in ".concat(ticks(schema.package)),
        });
    }
    if (schema.schema.description) {
        start.push({ p: schema.schema.description });
    }
    if (schema.schema.deprecated) {
        start.push({
            p: "**deprecated** ".concat(schema.schema.deprecated),
        });
    }
    var propertiesTable = (0, exports.documentSchema)(schema.schema, schemas, formats);
    var exampleFragment = (0, ramda_1.flatten)([
        { p: 'Example:' },
        {
            code: {
                language: 'json',
                content: (0, json_stable_stringify_1.default)(schema.example, { space: '  ' }),
            },
        },
    ]);
    return (0, ramda_1.flatten)(start.concat(propertiesTable).concat(exampleFragment));
};
exports.documentObjectSchema = documentObjectSchema;
//# sourceMappingURL=utils.js.map