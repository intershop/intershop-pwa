import { strings } from '@angular-devkit/core';
import { Rule, UpdateRecorder } from '@angular-devkit/schematics';
import { tsquery } from '@phenomnomnominal/tsquery';
import {
  addDeclarationToModule,
  addExportToModule,
  addImportToModule,
  addProviderToModule,
} from '@schematics/angular/utility/ast-utils';
import { InsertChange } from '@schematics/angular/utility/change';
import { buildRelativePath, findModule } from '@schematics/angular/utility/find-module';
import { ObjectLiteralExpression, SyntaxKind } from 'ts-morph';
import { ImportKind, findImports, forEachToken } from 'tsutils';
import * as ts from 'typescript';

import { readIntoSourceFile } from './filesystem';
import { createTsMorphProject } from './ts-morph';

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

export function addTokenProviderToNgModule(options: {
  module?: string;
  token?: string;
  class?: string;
  artifactPath?: string;
  multi?: boolean;
}): Rule {
  return host => {
    const tsMorphProject = createTsMorphProject(host);
    tsMorphProject.addSourceFileAtPath(options.module);
    const sourceFile = tsMorphProject.getSourceFile(options.module);

    (sourceFile.getClasses()[0].getDecorator('NgModule').getArguments()[0] as ObjectLiteralExpression)
      .getChildrenOfKind(SyntaxKind.PropertyAssignment)
      .find(child => child.getName() === 'providers')
      .getInitializerIfKindOrThrow(SyntaxKind.ArrayLiteralExpression)
      .addElement(`{ provide: ${options.token}, useClass: ${options.class}, multi: ${options.multi} }`);

    sourceFile
      .addImportDeclaration({
        moduleSpecifier: buildRelativePath(options.module, options.artifactPath),
      })
      .addNamedImport({ name: options.class });

    host.overwrite(options.module, sourceFile.getText());
    return host;
  };
}

export function insertImport(
  source: ts.SourceFile,
  recorder: UpdateRecorder,
  artifactName: string,
  relativePath: string
) {
  const imp = `import { ${artifactName} } from '${relativePath}';`;

  // insert import statement to imports
  const lastImportEnd = findImports(source, ImportKind.All)
    .map(x => x.parent.end)
    .sort((x, y) => x - y)
    .pop();
  if (lastImportEnd) {
    recorder.insertRight(lastImportEnd, `\n${imp}`);
  } else {
    recorder.insertLeft(0, `${imp}\n\n`);
  }
}

export function insertExport(recorder: UpdateRecorder, artifactName: string, relativePath: string) {
  const imp = `export { ${artifactName} } from '${relativePath}';`;
  recorder.insertLeft(0, `${imp}\n\n`);
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

export function addExportToBarrelFile(options: {
  path?: string;
  artifactName?: string;
  moduleImportPath?: string;
}): Rule {
  const barrelFile = `/${options.path}/index.ts`;
  return host => {
    if (!tsquery(readIntoSourceFile(host, barrelFile), `Identifier[name=${options.artifactName}]`).length) {
      const relativePath = buildRelativePath(barrelFile, options.moduleImportPath);
      const exportRecorder = host.beginUpdate(barrelFile);
      insertExport(exportRecorder, options.artifactName, relativePath);
      host.commitUpdate(exportRecorder);
    }
  };
}

export function addDecoratorToClass(
  file: string,
  className: string,
  decoratorName: string,
  decoratorImport: string
): Rule {
  return host => {
    const source = readIntoSourceFile(host, file);
    tsquery(source, `ClassDeclaration:has(Identifier[name=${className}])`).forEach(
      (classDeclaration: ts.ClassDeclaration) => {
        const exists = classDeclaration.decorators.find(decorator =>
          tsquery(decorator, 'Identifier').find(id => id.getText() === decoratorName)
        );
        if (!exists) {
          const recorder = host.beginUpdate(file);

          const exportKeyword = tsquery(
            source,
            `ClassDeclaration:has(Identifier[name=${className}]) > ExportKeyword`
          )[0];
          recorder.insertLeft(exportKeyword.getStart(), `@${decoratorName}()\n`);

          insertImport(source, recorder, decoratorName, decoratorImport);

          host.commitUpdate(recorder);
        }
      }
    );
  };
}

export function generateGitignore(options: { path?: string; content?: string }): Rule {
  const gitignore = `/${options.path}/.gitignore`;
  return host => {
    host.create(gitignore, options.content);
    return host;
  };
}

export function updateModule(options): Rule {
  return host => {
    options.module = findModule(host, options.path);
    return host;
  };
}
