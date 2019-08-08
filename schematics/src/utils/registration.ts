import { strings } from '@angular-devkit/core';
import { Rule, UpdateRecorder } from '@angular-devkit/schematics';
import {
  addDeclarationToModule,
  addEntryComponentToModule,
  addExportToModule,
  addImportToModule,
  addProviderToModule,
} from '@schematics/angular/utility/ast-utils';
import { InsertChange } from '@schematics/angular/utility/change';
import { buildRelativePath } from '@schematics/angular/utility/find-module';
import { ImportKind, findImports, forEachToken } from 'tsutils';
import * as ts from 'typescript';

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

export function addImportToNgModule(options: {
  module?: string;
  artifactName?: string;
  moduleImportPath?: string;
}): Rule {
  return host => {
    const relativePath = buildRelativePath(options.module, options.moduleImportPath);
    const source = readIntoSourceFile(host, options.module);

    const importRecorder = host.beginUpdate(options.module);
    const importChanges = addImportToModule(
      source,
      options.module,
      strings.classify(options.artifactName),
      relativePath
    );

    for (const change of importChanges) {
      if (change instanceof InsertChange) {
        importRecorder.insertLeft(change.pos, change.toAdd);
      }
    }
    host.commitUpdate(importRecorder);
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

export function addProviderToNgModule(options: {
  module?: string;
  artifactName?: string;
  moduleImportPath?: string;
}): Rule {
  return host => {
    const source = readIntoSourceFile(host, options.module);

    const relativePath = options.moduleImportPath
      ? buildRelativePath(options.module, options.moduleImportPath)
      : undefined;
    const declarationChanges = addProviderToModule(source, options.module, options.artifactName, relativePath);

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

export function insertImport(
  source: ts.SourceFile,
  recorder: UpdateRecorder,
  artifactName: string,
  relativePath: string
) {
  // insert import statement to imports
  const lastImportEnd = findImports(source, ImportKind.All)
    .map(x => x.parent.end)
    .sort((x, y) => x - y)
    .pop();
  recorder.insertRight(lastImportEnd, `\nimport { ${artifactName} } from '${relativePath}';`);
}

export function addImportToNgModuleBefore(
  options: {
    module?: string;
    artifactName?: string;
    moduleImportPath?: string;
  },
  beforeToken: string
): Rule {
  return host => {
    const relativePath = buildRelativePath(options.module, options.moduleImportPath);
    const source = readIntoSourceFile(host, options.module);
    const importRecorder = host.beginUpdate(options.module);

    insertImport(source, importRecorder, options.artifactName, relativePath);

    let edited = false;
    forEachToken(source, node => {
      if (
        node.kind === ts.SyntaxKind.Identifier &&
        node.getText() === beforeToken &&
        node.parent.kind === ts.SyntaxKind.ArrayLiteralExpression
      ) {
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

export function addImportToFile(options: { module?: string; artifactName?: string; moduleImportPath?: string }): Rule {
  return host => {
    const relativePath = buildRelativePath(options.module, options.moduleImportPath);
    const source = readIntoSourceFile(host, options.module);
    const importRecorder = host.beginUpdate(options.module);

    insertImport(source, importRecorder, options.artifactName, relativePath);

    host.commitUpdate(importRecorder);
  };
}
