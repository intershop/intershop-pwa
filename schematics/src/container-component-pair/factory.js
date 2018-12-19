"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const schematics_1 = require("@angular-devkit/schematics");
const common_1 = require("../utils/common");
function createContainerComponentPair(options) {
    return host => {
        if (!options.project) {
            throw new schematics_1.SchematicsException('Option (project) is required.');
        }
        // tslint:disable:no-parameter-reassignment
        options = common_1.applyNameAndPath(undefined, host, options);
        options = common_1.findDeclaringModule(host, options);
        const childOptions = {
            name: options.name,
            project: options.project,
            path: options.path,
            styleFile: options.styleFile,
            prefix: options.prefix,
        };
        return schematics_1.chain([
            schematics_1.schematic('component', childOptions),
            schematics_1.schematic('container', Object.assign({}, childOptions, { referenceSelector: common_1.generateSelector('component', host, childOptions).selector, export: true })),
        ]);
    };
}
exports.createContainerComponentPair = createContainerComponentPair;
