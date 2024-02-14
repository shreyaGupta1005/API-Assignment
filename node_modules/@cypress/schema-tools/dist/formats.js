"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDefaults = exports.regexAsPatternKey = exports.detectors = void 0;
var detectors = function (formats) {
    var result = {};
    Object.keys(formats).forEach(function (name) {
        result[name] = formats[name].detect;
    });
    return result;
};
exports.detectors = detectors;
var regexAsPatternKey = function (r) {
    var s = r.toString();
    var middle = s.substr(1, s.length - 2);
    return middle;
};
exports.regexAsPatternKey = regexAsPatternKey;
var getDefaults = function (formats) {
    var result = {};
    Object.keys(formats).forEach(function (key) {
        var format = formats[key];
        if (typeof format.defaultValue !== 'undefined') {
            result[format.name] = format.defaultValue;
        }
    });
    return result;
};
exports.getDefaults = getDefaults;
//# sourceMappingURL=formats.js.map