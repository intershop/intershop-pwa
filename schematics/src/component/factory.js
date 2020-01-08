"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular-devkit/core");
const schematics_1 = require("@angular-devkit/schematics");
const common_1 = require("../utils/common");
const registration_1 = require("../utils/registration");
function createComponent(options) {
    return host => {
        if (!options.project) {
            throw new schematics_1.SchematicsException('Option (project) is required.');
        }
        // tslint:disable:no-parameter-reassignment
        options = common_1.applyNameAndPath('component', host, options);
        options = common_1.determineArtifactName('component', host, options);
        options = common_1.generateSelector(host, options);
        options = common_1.findDeclaringModule(host, options);
        const operations = [];
        if (!options.skipImport) {
            operations.push(registration_1.addDeclarationToNgModule(options));
            if (options.entryComponent) {
                operations.push(registration_1.addEntryComponentToNgModule(options));
            }
            if (options.export) {
                operations.push(registration_1.addExportToNgModule(options));
            }
        }
        operations.push(schematics_1.mergeWith(schematics_1.apply(schematics_1.url('./files'), [
            options.styleFile ? schematics_1.noop() : schematics_1.filter(path => !path.endsWith('.__styleext__')),
            schematics_1.template(Object.assign({}, core_1.strings, options, { 'if-flat': s => (options.flat ? '' : s) })),
            schematics_1.move(options.path),
        ])));
        return schematics_1.chain(operations);
    };
}
exports.createComponent = createComponent;
