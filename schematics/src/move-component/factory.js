"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular-devkit/core");
const schematics_1 = require("@angular-devkit/schematics");
const tsquery_1 = require("@phenomnomnominal/tsquery");
const project_1 = require("@schematics/angular/utility/project");
const filesystem_1 = require("../utils/filesystem");
function similarIdx(str1, str2) {
    for (let index = 0; index < Math.min(str1.length, str2.length); index++) {
        if (str1[index] !== str2[index]) {
            return index;
        }
    }
    return 0;
}
function getAbsolutePath(base, rel) {
    if (rel.startsWith('..')) {
        const myPath = base.split('/');
        myPath.pop();
        const otherPath = rel.split('/').reverse();
        while (otherPath.length && otherPath[otherPath.length - 1] === '..') {
            otherPath.pop();
            myPath.pop();
        }
        for (const el of otherPath.reverse()) {
            myPath.push(el);
        }
        return myPath.join('/');
    }
}
function getRelativePath(base, abs) {
    const basePath = base.split('/');
    basePath.pop();
    const absPath = abs.split('/');
    while (basePath[0] === absPath[0]) {
        basePath.shift();
        absPath.shift();
    }
    while (basePath.length) {
        basePath.pop();
        absPath.splice(0, 0, '..');
    }
    return absPath.join('/');
}
function move(options) {
    return host => {
        if (!options.project) {
            throw new schematics_1.SchematicsException('Option (project) is required.');
        }
        if (!options.from) {
            throw new schematics_1.SchematicsException('Option (from) is required.');
        }
        if (!options.to) {
            throw new schematics_1.SchematicsException('Option (to) is required.');
        }
        const from = options.from.replace(/\/$/, '');
        host.getDir(from);
        const to = options.to.replace(/\/$/, '');
        const renames = [];
        const fromName = from.replace(/.*\//, '');
        const fromClassName = core_1.strings.classify(fromName) + 'Component';
        const toName = to.replace(/.*\//, '');
        if (toName.includes('.')) {
            throw new schematics_1.SchematicsException(`target must be a directory`);
        }
        const toClassName = core_1.strings.classify(toName) + 'Component';
        const similarIndex = similarIdx(from, to);
        const replacePath = (path) => path
            .replace(from.substr(similarIndex), to.substr(similarIndex))
            .replace(fromName + '.component', toName + '.component');
        const replaceImportPath = (file, path) => {
            const newPath = replacePath(path);
            if (path !== newPath) {
                return newPath;
            }
            else if (path.includes('..')) {
                const match = /(\.\.[\w\/\.\-]+)/.exec(path);
                if (match) {
                    const fromRelative = match[0];
                    const fromAbsolute = getAbsolutePath(file, fromRelative);
                    const toAbsolute = replacePath(fromAbsolute);
                    const potentiallyMovedFile = replacePath(file);
                    const toRelative = getRelativePath(potentiallyMovedFile, toAbsolute);
                    return path.replace(fromRelative, toRelative);
                }
            }
            return newPath;
        };
        // tslint:disable-next-line:no-console
        console.log('moving', options.from, '\n    to', options.to);
        const sourceRoot = project_1.getProject(host, options.project).sourceRoot;
        host.visit(file => {
            if (file.startsWith(`/${sourceRoot}/app/`)) {
                if (file.includes(from + '/')) {
                    renames.push([file, replacePath(file)]);
                    if (fromName !== toName && file.endsWith('.component.ts')) {
                        updateComponentDecorator(host, file, fromName, toName);
                    }
                }
                if (file.endsWith('.ts')) {
                    if (fromClassName !== toClassName) {
                        updateComponentClassName(host, file, fromClassName, toClassName);
                    }
                    const imports = tsquery_1.tsquery(filesystem_1.readIntoSourceFile(host, file), file.includes(fromName) ? `ImportDeclaration` : `ImportDeclaration[text=/.*${fromName}.*/]`).filter((x) => file.includes(fromName) || x.getText().includes(`/${fromName}/`));
                    if (imports.length) {
                        const updates = [];
                        imports.forEach(importDeclaration => {
                            tsquery_1.tsquery(importDeclaration, 'StringLiteral').forEach(node => {
                                const replacement = replaceImportPath(file, node.getFullText());
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
                else if (fromName !== toName && file.endsWith('.html')) {
                    updateComponentSelector(host, file, fromName, toName);
                }
            }
        });
        renames.forEach(([source, target]) => {
            host.create(target, host.read(source));
            host.delete(source);
        });
    };
}
exports.move = move;
function updateComponentSelector(host, file, fromName, toName, includePrefix = true) {
    const content = host.read(file).toString();
    const replacement = content.replace(new RegExp(`(?!.*${fromName}[a-z-]+.*)ish-${fromName}`, 'g'), (includePrefix ? 'ish-' : '') + toName);
    if (content !== replacement) {
        host.overwrite(file, replacement);
    }
}
exports.updateComponentSelector = updateComponentSelector;
function updateComponentClassName(host, file, fromClassName, toClassName) {
    const identifiers = tsquery_1.tsquery(filesystem_1.readIntoSourceFile(host, file), `Identifier[name=${fromClassName}]`);
    if (identifiers.length) {
        const updater = host.beginUpdate(file);
        identifiers.forEach(x => updater.remove(x.pos, x.end - x.pos).insertLeft(x.pos, x.getFullText().replace(fromClassName, toClassName)));
        host.commitUpdate(updater);
    }
}
exports.updateComponentClassName = updateComponentClassName;
function updateComponentDecorator(host, file, fromName, toName) {
    const updater = host.beginUpdate(file);
    tsquery_1.tsquery(filesystem_1.readIntoSourceFile(host, file), 'Decorator Identifier[name=Component]')
        .map(x => x.parent)
        .forEach(componentDecorator => {
        tsquery_1.tsquery(componentDecorator, 'PropertyAssignment')
            .map((pa) => pa.initializer)
            .forEach(x => {
            updater.remove(x.pos, x.end - x.pos).insertLeft(x.pos, x.getFullText().replace(fromName, toName));
        });
    });
    host.commitUpdate(updater);
}
exports.updateComponentDecorator = updateComponentDecorator;
