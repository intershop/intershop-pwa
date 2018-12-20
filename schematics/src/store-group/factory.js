"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular-devkit/core");
const schematics_1 = require("@angular-devkit/schematics");
const project_1 = require("@schematics/angular/utility/project");
const common_1 = require("../utils/common");
const registration_1 = require("../utils/registration");
function determineStoreGroupLocation(host, options) {
    const project = project_1.getProject(host, options.project);
    const path = core_1.normalize(`${project_1.buildDefaultPath(project)}/core/store/`);
    const module = core_1.normalize(`${path}/core-store.module.ts`);
    const artifactName = `${core_1.strings.classify(options.name)}StoreModule`;
    const moduleImportPath = core_1.normalize(`${path}/${core_1.strings.dasherize(options.name)}/${core_1.strings.dasherize(options.name)}-store.module`);
    return Object.assign({}, options, { path,
        module,
        artifactName,
        moduleImportPath });
}
exports.determineStoreGroupLocation = determineStoreGroupLocation;
function createStoreGroup(options) {
    return host => {
        if (!options.project) {
            throw new schematics_1.SchematicsException('Option (project) is required.');
        }
        // tslint:disable:no-parameter-reassignment
        options = common_1.applyNameAndPath('store', host, options);
        options = common_1.determineArtifactName('store', host, options);
        options = determineStoreGroupLocation(host, options);
        const operations = [];
        operations.push(schematics_1.mergeWith(schematics_1.apply(schematics_1.url('./files'), [
            schematics_1.template(Object.assign({}, core_1.strings, options)),
            schematics_1.move(options.path),
        ])));
        operations.push(registration_1.addImportToNgModule(options));
        return schematics_1.chain(operations);
    };
}
exports.createStoreGroup = createStoreGroup;
