"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular-devkit/core");
const ast_utils_1 = require("@schematics/angular/utility/ast-utils");
const change_1 = require("@schematics/angular/utility/change");
const find_module_1 = require("@schematics/angular/utility/find-module");
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
