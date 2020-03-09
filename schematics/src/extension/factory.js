"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular-devkit/core");
const schematics_1 = require("@angular-devkit/schematics");
const project_1 = require("@schematics/angular/utility/project");
const common_1 = require("../utils/common");
const registration_1 = require("../utils/registration");
function createExtension(options) {
    return host => {
        if (!options.project) {
            throw new schematics_1.SchematicsException('Option (project) is required.');
        }
        // tslint:disable:no-parameter-reassignment
        options = common_1.detectExtension('extension', host, options);
        options = common_1.applyNameAndPath('extension', host, options);
        options = common_1.determineArtifactName('extension', host, options);
        const operations = [];
        operations.push(schematics_1.mergeWith(schematics_1.apply(schematics_1.url('./files'), [
            schematics_1.template(Object.assign({}, core_1.strings, options)),
            schematics_1.move(options.path),
        ])));
        const projectRoot = project_1.buildDefaultPath(project_1.getProject(host, options.project));
        const moduleImportOptions = {
            artifactName: core_1.strings.classify(options.name) + 'ExportsModule',
            moduleImportPath: `${projectRoot}/extensions/${core_1.strings.dasherize(options.name)}/exports/${core_1.strings.dasherize(options.name)}-exports.module`,
        };
        const sharedModuleOptions = Object.assign({ module: `${projectRoot}/shared/shared.module.ts` }, moduleImportOptions);
        operations.push(registration_1.addExportToNgModule(sharedModuleOptions));
        operations.push(registration_1.addImportToNgModule(sharedModuleOptions));
        const shellModuleOptions = Object.assign({ module: `${projectRoot}/shell/shell.module.ts` }, moduleImportOptions);
        operations.push(registration_1.addImportToNgModule(shellModuleOptions));
        const appModuleOptions = {
            module: `${projectRoot}/app.module.ts`,
            artifactName: core_1.strings.classify(options.name) + 'RoutingModule',
            moduleImportPath: `${projectRoot}/extensions/${core_1.strings.dasherize(options.name)}/pages/${core_1.strings.dasherize(options.name)}-routing.module`,
        };
        operations.push(registration_1.addImportToNgModuleBefore(appModuleOptions, 'AppLastRoutingModule'));
        return schematics_1.chain(operations);
    };
}
exports.createExtension = createExtension;
