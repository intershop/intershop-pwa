"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular-devkit/core");
const schematics_1 = require("@angular-devkit/schematics");
const tsquery_1 = require("@phenomnomnominal/tsquery");
const project_1 = require("@schematics/angular/utility/project");
const path_1 = require("path");
const factory_1 = require("../move-component/factory");
const common_1 = require("../utils/common");
const filesystem_1 = require("../utils/filesystem");
const registration_1 = require("../utils/registration");
function customize(options) {
    return host => {
        if (!options.project) {
            throw new schematics_1.SchematicsException('Option (project) is required.');
        }
        if (!options.from) {
            throw new schematics_1.SchematicsException('Option (from) is required.');
        }
        const project = project_1.getProject(host, options.project);
        const from = options.from.replace(/\/$/, '');
        const sourceRoot = project.sourceRoot;
        const dir = host.getDir(`${sourceRoot}/app/${from}`);
        const fromName = path_1.basename(dir.path);
        if (!dir || !dir.subfiles.length || !dir.subfiles.find(v => v.endsWith('component.ts'))) {
            throw new schematics_1.SchematicsException('Option (from) is not pointing to a component folder.');
        }
        dir.subfiles.forEach(file => {
            host.create(path_1.join(dir.parent.path, `${project.prefix}-${fromName}`, `${project.prefix}-${file}`), host.read(dir.file(file).path));
        });
        const toName = `${project.prefix}-${fromName}`;
        host.visit(file => {
            if (file.startsWith(`/${sourceRoot}/app/`) && !file.includes(`/${fromName}/${fromName}.component`)) {
                if (file.includes(`/${project.prefix}-${fromName}/`) && file.endsWith('.component.ts')) {
                    factory_1.updateComponentDecorator(host, file, `ish-${fromName}`, fromName);
                    factory_1.updateComponentDecorator(host, file, fromName, toName);
                }
                if (file.endsWith('.ts')) {
                    factory_1.updateComponentClassName(host, file, core_1.strings.classify(fromName) + 'Component', core_1.strings.classify(toName) + 'Component');
                    const imports = tsquery_1.tsquery(filesystem_1.readIntoSourceFile(host, file), file.includes(toName) ? `ImportDeclaration` : `ImportDeclaration[text=/.*${fromName}.*/]`).filter((x) => file.includes(fromName) || x.getText().includes(`/${fromName}/`));
                    if (imports.length) {
                        const updates = [];
                        imports.forEach(importDeclaration => {
                            tsquery_1.tsquery(importDeclaration, 'StringLiteral').forEach(node => {
                                const replacement = node
                                    .getFullText()
                                    .replace(new RegExp(`/${fromName}/${fromName}.component`), `/${toName}/${toName}.component`)
                                    .replace(new RegExp(`/${fromName}.component`), `/${toName}.component`);
                                if (node.getFullText() !== replacement) {
                                    updates.push({ node, replacement });
                                }
                            });
                        });
                        if (updates.length) {
                            const updater = host.beginUpdate(file);
                            updates.forEach(({ node, replacement }) => {
                                updater.remove(node.pos, node.end - node.pos).insertLeft(node.pos, replacement);
                            });
                            host.commitUpdate(updater);
                        }
                    }
                }
                factory_1.updateComponentSelector(host, file, fromName, `${project.prefix}-${fromName}`, false);
            }
        });
        let options2 = { name: from, project: options.project };
        options2 = common_1.applyNameAndPath('component', host, options2);
        options2 = common_1.determineArtifactName('component', host, options2);
        options2 = common_1.findDeclaringModule(host, options2);
        return registration_1.addDeclarationToNgModule(options2);
    };
}
exports.customize = customize;
