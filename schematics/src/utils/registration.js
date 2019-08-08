"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular-devkit/core");
const ast_utils_1 = require("@schematics/angular/utility/ast-utils");
const change_1 = require("@schematics/angular/utility/change");
const find_module_1 = require("@schematics/angular/utility/find-module");
const tsutils_1 = require("tsutils");
const ts = require("typescript");
const filesystem_1 = require("./filesystem");
function addExportToNgModule(options) {
    return host => {
        const relativePath = find_module_1.buildRelativePath(options.module, options.moduleImportPath);
        const source = filesystem_1.readIntoSourceFile(host, options.module);
        const exportRecorder = host.beginUpdate(options.module);
        const exportChanges = ast_utils_1.addExportToModule(source, options.module, core_1.strings.classify(options.artifactName), relativePath);
        for (const change of exportChanges) {
            if (change instanceof change_1.InsertChange) {
                exportRecorder.insertLeft(change.pos, change.toAdd);
            }
        }
        host.commitUpdate(exportRecorder);
    };
}
exports.addExportToNgModule = addExportToNgModule;
function addImportToNgModule(options) {
    return host => {
        const relativePath = find_module_1.buildRelativePath(options.module, options.moduleImportPath);
        const source = filesystem_1.readIntoSourceFile(host, options.module);
        const importRecorder = host.beginUpdate(options.module);
        const importChanges = ast_utils_1.addImportToModule(source, options.module, core_1.strings.classify(options.artifactName), relativePath);
        for (const change of importChanges) {
            if (change instanceof change_1.InsertChange) {
                importRecorder.insertLeft(change.pos, change.toAdd);
            }
        }
        host.commitUpdate(importRecorder);
    };
}
exports.addImportToNgModule = addImportToNgModule;
function addEntryComponentToNgModule(options) {
    return host => {
        const relativePath = find_module_1.buildRelativePath(options.module, options.moduleImportPath);
        const source = filesystem_1.readIntoSourceFile(host, options.module);
        const entryComponentRecorder = host.beginUpdate(options.module);
        const entryComponentChanges = ast_utils_1.addEntryComponentToModule(source, options.module, core_1.strings.classify(options.artifactName), relativePath);
        for (const change of entryComponentChanges) {
            if (change instanceof change_1.InsertChange) {
                entryComponentRecorder.insertLeft(change.pos, change.toAdd);
            }
        }
        host.commitUpdate(entryComponentRecorder);
    };
}
exports.addEntryComponentToNgModule = addEntryComponentToNgModule;
function addDeclarationToNgModule(options) {
    return host => {
        const source = filesystem_1.readIntoSourceFile(host, options.module);
        const relativePath = find_module_1.buildRelativePath(options.module, options.moduleImportPath);
        const declarationChanges = ast_utils_1.addDeclarationToModule(source, options.module, options.artifactName, relativePath);
        const declarationRecorder = host.beginUpdate(options.module);
        for (const change of declarationChanges) {
            if (change instanceof change_1.InsertChange) {
                declarationRecorder.insertLeft(change.pos, change.toAdd);
            }
        }
        host.commitUpdate(declarationRecorder);
        return host;
    };
}
exports.addDeclarationToNgModule = addDeclarationToNgModule;
function addProviderToNgModule(options) {
    return host => {
        const source = filesystem_1.readIntoSourceFile(host, options.module);
        const relativePath = options.moduleImportPath
            ? find_module_1.buildRelativePath(options.module, options.moduleImportPath)
            : undefined;
        const declarationChanges = ast_utils_1.addProviderToModule(source, options.module, options.artifactName, relativePath);
        const declarationRecorder = host.beginUpdate(options.module);
        for (const change of declarationChanges) {
            if (change instanceof change_1.InsertChange) {
                declarationRecorder.insertLeft(change.pos, change.toAdd);
            }
        }
        host.commitUpdate(declarationRecorder);
        return host;
    };
}
exports.addProviderToNgModule = addProviderToNgModule;
function insertImport(source, recorder, artifactName, relativePath) {
    // insert import statement to imports
    const lastImportEnd = tsutils_1.findImports(source, tsutils_1.ImportKind.All)
        .map(x => x.parent.end)
        .sort((x, y) => x - y)
        .pop();
    recorder.insertRight(lastImportEnd, `\nimport { ${artifactName} } from '${relativePath}';`);
}
exports.insertImport = insertImport;
function addImportToNgModuleBefore(options, beforeToken) {
    return host => {
        const relativePath = find_module_1.buildRelativePath(options.module, options.moduleImportPath);
        const source = filesystem_1.readIntoSourceFile(host, options.module);
        const importRecorder = host.beginUpdate(options.module);
        insertImport(source, importRecorder, options.artifactName, relativePath);
        let edited = false;
        tsutils_1.forEachToken(source, node => {
            if (node.kind === ts.SyntaxKind.Identifier &&
                node.getText() === beforeToken &&
                node.parent.kind === ts.SyntaxKind.ArrayLiteralExpression) {
                importRecorder.insertLeft(node.getStart(), `${options.artifactName}, `);
                edited = true;
            }
        });
        if (!edited) {
            throw new Error(`did not find '${beforeToken}' in ${options.module}`);
        }
        host.commitUpdate(importRecorder);
    };
}
exports.addImportToNgModuleBefore = addImportToNgModuleBefore;
function addImportToFile(options) {
    return host => {
        const relativePath = find_module_1.buildRelativePath(options.module, options.moduleImportPath);
        const source = filesystem_1.readIntoSourceFile(host, options.module);
        const importRecorder = host.beginUpdate(options.module);
        insertImport(source, importRecorder, options.artifactName, relativePath);
        host.commitUpdate(importRecorder);
    };
}
exports.addImportToFile = addImportToFile;
