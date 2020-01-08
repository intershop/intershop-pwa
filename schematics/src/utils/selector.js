"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular-devkit/core");
function buildSelector(options, projectPrefix) {
    const selector = core_1.strings.dasherize(options.name);
    if (options.prefix === '') {
        return selector;
    }
    const prefix = options.prefix || projectPrefix;
    if (!selector.startsWith(`${prefix}-`)) {
        return `${prefix}-${selector}`;
    }
    return selector;
}
exports.buildSelector = buildSelector;
