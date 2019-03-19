"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular-devkit/core");
const schematics_1 = require("@angular-devkit/schematics");
const common_1 = require("../utils/common");
const registration_1 = require("../utils/registration");
function createPipe(options) {
    return host => {
        if (!options.project) {
            throw new schematics_1.SchematicsException('Option (project) is required.');
        }
        // tslint:disable:no-parameter-reassignment
        options = common_1.detectExtension('pipe', host, options);
        options = common_1.applyNameAndPath('pipe', host, options);
        options = common_1.determineArtifactName('pipe', host, options);
        if (!options.extension) {
            options.module = `core/pipes.module`;
        }
        else {
            options.module = `extensions/${options.extension}/${options.extension}.module`;
        }
        options = common_1.findDeclaringModule(host, options);
        const operations = [];
        if (!options.skipImport) {
            operations.push(registration_1.addDeclarationToNgModule(options));
            operations.push(registration_1.addExportToNgModule(options));
            operations.push(registration_1.addProviderToNgModule(options));
        }
        operations.push(schematics_1.mergeWith(schematics_1.apply(schematics_1.url('./files'), [
            schematics_1.template(Object.assign({}, core_1.strings, options)),
            schematics_1.move(options.path),
        ])));
        return schematics_1.chain(operations);
    };
}
exports.createPipe = createPipe;
