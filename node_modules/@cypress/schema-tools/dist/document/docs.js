"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.documentSchemas = void 0;
var json2md_1 = __importDefault(require("json2md"));
var ramda_1 = require("ramda");
var __1 = require("..");
var doc_formats_1 = require("./doc-formats");
var utils_1 = require("./utils");
var title = [{ h1: 'Schemas' }];
var titleLink = [{ p: '[🔝](#schemas)' }];
function documentSchemas(schemas, formats) {
    var toDoc = function (schemaName) {
        var versions = (0, __1.getSchemaVersions)(schemas)(schemaName);
        if (!versions.length) {
            return [{ h2: "\u26A0\uFE0F Could not find any versions of schema ".concat(schemaName) }];
        }
        var documentSchemaVersion = function (version) {
            var schema = (0, __1.getObjectSchema)(schemas)(schemaName)(version);
            if (!schema) {
                throw new Error("cannot find schema ".concat(schemaName, "@").concat(version));
            }
            var schemaDoc = (0, utils_1.documentObjectSchema)(schema, schemas, formats);
            return (0, ramda_1.flatten)(schemaDoc.concat(titleLink));
        };
        var versionFragments = versions.map(documentSchemaVersion);
        var start = [{ h2: (0, __1.normalizeName)(schemaName) }];
        return start.concat((0, ramda_1.flatten)(versionFragments));
    };
    var fragments = (0, ramda_1.flatten)((0, __1.schemaNames)(schemas).map(toDoc));
    var schemaNameToTopLevelLink = function (schemaName) {
        return "[".concat(schemaName, "](#").concat((0, utils_1.anchor)(schemaName), ")");
    };
    var schemaVersionLink = function (schemaName) { return function (version) {
        return "[".concat(version, "](#").concat((0, utils_1.anchor)(schemaName + version), ")");
    }; };
    var tocHeading = function (schemaName) {
        var versions = (0, __1.getSchemaVersions)(schemas)(schemaName);
        var topLink = schemaNameToTopLevelLink(schemaName);
        if (versions.length < 2) {
            return topLink;
        }
        else {
            var versionLinks = versions.map(schemaVersionLink(schemaName));
            var linkWithVersions = topLink + ' - ' + versionLinks.join(', ');
            return linkWithVersions;
        }
    };
    var headings = (0, __1.schemaNames)(schemas);
    var toc = [
        {
            ul: headings.map(tocHeading),
        },
    ];
    var list = title.concat(toc).concat(fragments);
    if (formats) {
        list = list.concat((0, doc_formats_1.documentCustomFormats)(formats)).concat(titleLink);
    }
    return (0, json2md_1.default)(list);
}
exports.documentSchemas = documentSchemas;
//# sourceMappingURL=docs.js.map