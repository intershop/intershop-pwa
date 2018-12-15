"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular-devkit/core");
const schematics_1 = require("@angular-devkit/schematics");
const project_1 = require("@schematics/angular/utility/project");
const tsutils_1 = require("tsutils");
const ts = require("typescript");
const common_1 = require("../utils/common");
const filesystem_1 = require("../utils/filesystem");
const registration_1 = require("../utils/registration");
function determineStoreLocation(host, options) {
    const project = project_1.getProject(host, options.project);
    let extension = options.extension;
    const regex = /extensions\/([a-z][a-z0-9-]+)/;
    const requestDestination = core_1.normalize(`${options.path}/${options.name}`);
    if (regex.test(requestDestination)) {
        extension = requestDestination.match(regex)[1];
    }
    let feature = options.feature;
    const regex2 = /store\/([a-z][a-z0-9-]+)\//;
    const requestDestination2 = core_1.normalize(`${options.path}/${options.name}`);
    if (regex2.test(requestDestination2)) {
        feature = requestDestination2.match(regex2)[1];
    }
    let parent;
    let path = options.path;
    if (!extension && !feature) {
        path = `${project.sourceRoot}/app/core/store/`;
        parent = 'core';
    }
    else if (!extension && feature) {
        path = `${project.sourceRoot}/app/core/store/${feature}/`;
        parent = feature;
    }
    else if (extension && !feature) {
        path = `${project.sourceRoot}/app/extensions/${extension}/store/`;
        parent = extension;
    }
    else {
        throw new Error('cannot add feature store in extension');
    }
    return Object.assign({}, options, { parentStorePath: `${path}${parent}`, extension,
        feature,
        path,
        parent });
}
exports.determineStoreLocation = determineStoreLocation;
function registerStateInStore(options) {
    return host => {
        const artifactName = `${core_1.strings.classify(options.name)}State`;
        const file = core_1.normalize(`${options.parentStorePath}-store.ts`);
        const parentArtifact = `${core_1.strings.classify(options.parent)}State`;
        const source = filesystem_1.readIntoSourceFile(host, file);
        const update = host.beginUpdate(file);
        tsutils_1.forEachToken(source, node => {
            if (node.kind === ts.SyntaxKind.Identifier &&
                node.getText() === parentArtifact &&
                node.parent.kind === ts.SyntaxKind.InterfaceDeclaration) {
                const stateInterface = node.parent;
                const closingBrace = stateInterface.getChildren().filter(n => n.kind === ts.SyntaxKind.CloseBraceToken)[0];
                update.insertLeft(closingBrace.pos, `\n  ${core_1.strings.camelize(options.name)}: ${artifactName};`);
            }
        });
        const relativePath = `./${core_1.strings.dasherize(options.name)}/${core_1.strings.dasherize(options.name)}.reducer`;
        registration_1.insertImport(source, update, artifactName, relativePath);
        host.commitUpdate(update);
        return host;
    };
}
function registerReducerInStoreModule(options) {
    return host => {
        const artifactName = `${core_1.strings.camelize(options.name)}Reducer`;
        const file = `${options.parentStorePath}-store.module.ts`;
        const parentArtifact = `${core_1.strings.camelize(options.parent)}Reducers`;
        const source = filesystem_1.readIntoSourceFile(host, file);
        const update = host.beginUpdate(file);
        tsutils_1.forEachToken(source, node => {
            if (node.kind === ts.SyntaxKind.Identifier &&
                node.getText() === parentArtifact &&
                node.parent.kind === ts.SyntaxKind.VariableDeclaration) {
                const declaration = node.parent;
                const map = declaration.initializer;
                update.insertLeft(map.properties.end, `${map.properties.hasTrailingComma || map.properties.length === 0 ? '' : ','} ${core_1.strings.camelize(options.name)}: ${artifactName}`);
            }
        });
        const relativePath = `./${core_1.strings.dasherize(options.name)}/${core_1.strings.dasherize(options.name)}.reducer`;
        registration_1.insertImport(source, update, artifactName, relativePath);
        host.commitUpdate(update);
        return host;
    };
}
function registerEffectsInStoreModule(options) {
    return host => {
        const artifactName = `${core_1.strings.classify(options.name)}Effects`;
        const file = `${options.parentStorePath}-store.module.ts`;
        const parentArtifact = `${core_1.strings.camelize(options.parent)}Effects`;
        const source = filesystem_1.readIntoSourceFile(host, file);
        const update = host.beginUpdate(file);
        tsutils_1.forEachToken(source, node => {
            if (node.kind === ts.SyntaxKind.Identifier &&
                node.getText() === parentArtifact &&
                node.parent.kind === ts.SyntaxKind.VariableDeclaration) {
                const declaration = node.parent;
                const list = declaration.initializer;
                update.insertLeft(list.elements.end, `${list.elements.hasTrailingComma || list.elements.length === 0 ? '' : ','} ${artifactName}`);
            }
        });
        const relativePath = `./${core_1.strings.dasherize(options.name)}/${core_1.strings.dasherize(options.name)}.effects`;
        registration_1.insertImport(source, update, artifactName, relativePath);
        host.commitUpdate(update);
        return host;
    };
}
function createStore(options) {
    return host => {
        if (!options.project) {
            throw new schematics_1.SchematicsException('Option (project) is required.');
        }
        // tslint:disable:no-parameter-reassignment
        options = determineStoreLocation(host, options);
        options = common_1.applyNameAndPath('store', host, options);
        options = common_1.determineArtifactName('store', host, options);
        const operations = [];
        operations.push(schematics_1.mergeWith(schematics_1.apply(schematics_1.url('./files'), [
            schematics_1.template(Object.assign({}, core_1.strings, options)),
            schematics_1.move(options.path),
        ])));
        operations.push(registerStateInStore(options));
        operations.push(registerEffectsInStoreModule(options));
        operations.push(registerReducerInStoreModule(options));
        return schematics_1.chain(operations);
    };
}
exports.createStore = createStore;
