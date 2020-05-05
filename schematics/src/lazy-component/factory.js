"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular-devkit/core");
const schematics_1 = require("@angular-devkit/schematics");
const tsquery_1 = require("@phenomnomnominal/tsquery");
const project_1 = require("@schematics/angular/utility/project");
const ts = require("typescript");
const common_1 = require("../utils/common");
const registration_1 = require("../utils/registration");
function createLazyComponent(options) {
    return host => {
        if (!options.project) {
            throw new schematics_1.SchematicsException('Option (project) is required.');
        }
        const project = project_1.getProject(host, options.project);
        const originalPath = options.path.replace(/.*src\/app\//, '');
        const componentPath = `/${project.sourceRoot}/app/${originalPath}`;
        if (!originalPath.endsWith('component.ts') ||
            !originalPath.startsWith('extensions/') ||
            !host.exists(componentPath)) {
            throw new schematics_1.SchematicsException('path does not point to an existing component in an extension');
        }
        const pathSplits = originalPath.split('/');
        const extension = pathSplits[1];
        const group = pathSplits[pathSplits.length - 3];
        const originalName = /\/([a-z0-9-]+)\.component\.ts/.exec(originalPath)[1];
        options.name = 'lazy-' + originalName;
        // tslint:disable: no-parameter-reassignment
        options = common_1.generateSelector(host, options);
        options.path = `${project.sourceRoot}/app/extensions/${extension}/exports/${group}`;
        options = common_1.findDeclaringModule(host, options);
        options = common_1.determineArtifactName('component', host, options);
        let bindings = [];
        let imports = [];
        const componentContent = host.read(componentPath).toString('utf-8');
        if (componentContent.includes('@Input(')) {
            const componentSource = ts.createSourceFile(componentPath, componentContent, ts.ScriptTarget.Latest, true);
            const bindingNodes = tsquery_1.tsquery(componentSource, 'PropertyDeclaration:has(Decorator Identifier[text=Input])');
            bindings = bindingNodes.map(node => ({
                declaration: node.getText(),
                name: node.name.getText(),
            }));
            const importTypes = bindingNodes
                .map(node => node.getChildAt(3))
                .filter(node => ts.isTypeReferenceNode(node))
                .map(node => node.getText());
            if (importTypes.length) {
                const importDeclarations = tsquery_1.tsquery(componentSource, 'ImportDeclaration');
                imports = importDeclarations
                    .map(decl => ({
                    from: decl.moduleSpecifier.getText(),
                    types: decl.importClause.namedBindings
                        ? tsquery_1.tsquery(decl.importClause.namedBindings, 'Identifier')
                            .map(n => n.getText())
                            .filter(importType => importTypes.includes(importType))
                        : [],
                }))
                    .filter(decl => decl.types.length);
                // .forEach(t => console.log(t));
            }
        }
        const operations = [];
        if (!options.ci) {
            operations.push(registration_1.addDeclarationToNgModule(options));
            operations.push(registration_1.addExportToNgModule(options));
            operations.push(registration_1.addDecoratorToClass(componentPath, core_1.strings.classify(originalName + 'Component'), 'GenerateLazyComponent', 'ish-core/utils/module-loader/generate-lazy-component.decorator'));
        }
        operations.push(schematics_1.mergeWith(schematics_1.apply(schematics_1.url('./files'), [
            schematics_1.template(Object.assign(Object.assign(Object.assign({}, core_1.strings), options), { bindings,
                imports,
                originalPath,
                group,
                extension,
                originalName })),
            schematics_1.move(`/${project.sourceRoot}/app/extensions/${extension}/exports/${group}`),
            schematics_1.forEach(fileEntry => {
                if (host.exists(fileEntry.path)) {
                    host.overwrite(fileEntry.path, fileEntry.content);
                    // tslint:disable-next-line: no-null-keyword
                    return null;
                }
                else {
                    return fileEntry;
                }
            }),
        ])));
        return schematics_1.chain(operations);
    };
}
exports.createLazyComponent = createLazyComponent;
