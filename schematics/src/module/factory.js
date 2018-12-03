"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular-devkit/core");
const schematics_1 = require("@angular-devkit/schematics");
const common_1 = require("../utils/common");
function createModule(options) {
    return host => {
        if (!options.project) {
            throw new schematics_1.SchematicsException('Option (project) is required.');
        }
        // tslint:disable:no-parameter-reassignment
        options = common_1.applyNameAndPath('module', host, options);
        options = common_1.determineArtifactName('module', host, options);
        return schematics_1.mergeWith(schematics_1.apply(schematics_1.url('./files'), [
            schematics_1.template(Object.assign({}, core_1.strings, options, { 'if-flat': s => (options.flat ? '' : s) })),
            schematics_1.move(options.path),
        ]));
    };
}
exports.createModule = createModule;
