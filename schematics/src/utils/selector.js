"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular-devkit/core");
function buildSelector(artifact, options, projectPrefix) {
    let selector = core_1.strings.dasherize(options.name);
    if (options.prefix) {
        selector = `${options.prefix}-${selector}`;
    }
    else if (options.prefix === undefined && projectPrefix) {
        selector = `${projectPrefix}-${selector}`;
    }
    if (artifact === 'container') {
        selector += '-container';
    }
    return selector;
}
exports.buildSelector = buildSelector;
