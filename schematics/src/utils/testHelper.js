"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@angular-devkit/schematics/testing");
const operators_1 = require("rxjs/operators");
function createSchematicRunner() {
    return new testing_1.SchematicTestRunner('intershop-schematics', require.resolve('../collection.json'));
}
exports.createSchematicRunner = createSchematicRunner;
function createApplication(schematicRunner) {
    return schematicRunner
        .runExternalSchematicAsync('@schematics/angular', 'workspace', {
        name: 'workspace',
        newProjectRoot: 'projects',
        version: '6.0.0',
    })
        .pipe(operators_1.switchMap(workspace => schematicRunner.runExternalSchematicAsync('@schematics/angular', 'application', {
        name: 'bar',
        inlineStyle: false,
        inlineTemplate: false,
        routing: true,
        style: 'css',
        skipTests: false,
        skipPackageJson: false,
        prefix: 'ish',
    }, workspace)));
}
exports.createApplication = createApplication;
function createModule(schematicRunner, options) {
    return (source$) => source$.pipe(operators_1.switchMap(tree => schematicRunner.runSchematicAsync('module', Object.assign({}, options, { project: 'bar' }), tree)));
}
exports.createModule = createModule;
function createAppLastRoutingModule(schematicRunner) {
    return (source$) => source$.pipe(operators_1.switchMap(tree => schematicRunner.runExternalSchematicAsync('@schematics/angular', 'module', {
        name: 'pages/app-last-routing',
        flat: true,
        module: 'app.module',
        project: 'bar',
    }, tree)));
}
exports.createAppLastRoutingModule = createAppLastRoutingModule;
