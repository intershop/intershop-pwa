import { strings } from '@angular-devkit/core';
import { Rule } from '@angular-devkit/schematics';
import {
  addDeclarationToModule,
  addEntryComponentToModule,
  addExportToModule,
} from '@schematics/angular/utility/ast-utils';
import { InsertChange } from '@schematics/angular/utility/change';
import { buildRelativePath } from '@schematics/angular/utility/find-module';

import { readIntoSourceFile } from './filesystem';

export function addExportToNgModule(options: {
  module?: string;
  artifactName?: string;
  moduleImportPath?: string;
}): Rule {
  return host => {
    const relativePath = buildRelativePath(options.module, options.moduleImportPath);
    const source = readIntoSourceFile(host, options.module);

    const exportRecorder = host.beginUpdate(options.module);
    const exportChanges = addExportToModule(
      source,
      options.module,
      strings.classify(options.artifactName),
      relativePath
    );

    for (const change of exportChanges) {
      if (change instanceof InsertChange) {
        exportRecorder.insertLeft(change.pos, change.toAdd);
      }
    }
    host.commitUpdate(exportRecorder);
  };
}

export function addEntryComponentToNgModule(options: {
  module?: string;
  artifactName?: string;
  moduleImportPath?: string;
}): Rule {
  return host => {
    const relativePath = buildRelativePath(options.module, options.moduleImportPath);
    const source = readIntoSourceFile(host, options.module);

    const entryComponentRecorder = host.beginUpdate(options.module);
    const entryComponentChanges = addEntryComponentToModule(
      source,
      options.module,
      strings.classify(options.artifactName),
      relativePath
    );

    for (const change of entryComponentChanges) {
      if (change instanceof InsertChange) {
        entryComponentRecorder.insertLeft(change.pos, change.toAdd);
      }
    }
    host.commitUpdate(entryComponentRecorder);
  };
}

export function addDeclarationToNgModule(options: {
  module?: string;
  artifactName?: string;
  moduleImportPath?: string;
}): Rule {
  return host => {
    const source = readIntoSourceFile(host, options.module);

    const relativePath = buildRelativePath(options.module, options.moduleImportPath);
    const declarationChanges = addDeclarationToModule(source, options.module, options.artifactName, relativePath);

    const declarationRecorder = host.beginUpdate(options.module);
    for (const change of declarationChanges) {
      if (change instanceof InsertChange) {
        declarationRecorder.insertLeft(change.pos, change.toAdd);
      }
    }
    host.commitUpdate(declarationRecorder);

    return host;
  };
}
