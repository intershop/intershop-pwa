import { strings } from '@angular-devkit/core';
import {
  Rule,
  SchematicsException,
  apply,
  applyTemplates,
  chain,
  forEach,
  mergeWith,
  move,
  url,
} from '@angular-devkit/schematics';
import { tsquery } from '@phenomnomnominal/tsquery';
import { getProject } from '@schematics/angular/utility/project';
import * as ts from 'typescript';

import { determineArtifactName, findDeclaringModule, generateSelector } from '../utils/common';
import { applyLintFix } from '../utils/lint-fix';
import { addDeclarationToNgModule, addDecoratorToClass, addExportToNgModule } from '../utils/registration';

import { PWALazyComponentOptionsSchema as Options } from './schema';

export function createLazyComponent(options: Options): Rule {
  return host => {
    if (!options.project) {
      throw new SchematicsException('Option (project) is required.');
    }
    const project = getProject(host, options.project);

    const originalPath = options.path.replace(/.*src\/app\//, '');
    const componentPath = `/${project.sourceRoot}/app/${originalPath}`;

    if (
      !originalPath.endsWith('component.ts') ||
      !originalPath.startsWith('extensions/') ||
      !host.exists(componentPath)
    ) {
      throw new SchematicsException('path does not point to an existing component in an extension');
    }

    const pathSplits = originalPath.split('/');
    const extension = pathSplits[1];
    const group = pathSplits[pathSplits.length - 3];
    const originalName = /\/([a-z0-9-]+)\.component\.ts/.exec(originalPath)[1];
    options.name = 'lazy-' + originalName;
    // tslint:disable: no-parameter-reassignment
    options = generateSelector(host, options);
    options.path = `${project.sourceRoot}/app/extensions/${extension}/exports/${group}`;
    options = findDeclaringModule(host, options);
    options = determineArtifactName('component', host, options);

    let bindings: { declaration: string; name: string }[] = [];
    let imports: { types: string[]; from: string }[] = [];

    const componentContent = host.read(componentPath).toString('utf-8');
    if (componentContent.includes('@Input(')) {
      const componentSource = ts.createSourceFile(componentPath, componentContent, ts.ScriptTarget.Latest, true);
      const bindingNodes = tsquery(
        componentSource,
        'PropertyDeclaration:has(Decorator Identifier[text=Input])'
      ) as ts.PropertyDeclaration[];

      bindings = bindingNodes.map(node => ({
        declaration: node.getText(),
        name: node.name.getText(),
      }));

      const importTypes = bindingNodes
        .map(node => tsquery(node, 'TypeReference > Identifier').map(identifier => identifier.getText()))
        .reduce((acc, val) => acc.concat(...val), []);

      if (importTypes.length) {
        const importDeclarations = tsquery(componentSource, 'ImportDeclaration') as ts.ImportDeclaration[];
        imports = importDeclarations
          .map(decl => ({
            from: decl.moduleSpecifier.getText(),
            types: decl.importClause.namedBindings
              ? tsquery(decl.importClause.namedBindings, 'Identifier')
                  .map(n => n.getText())
                  .filter(importType => importTypes.includes(importType))
              : [],
          }))
          .filter(decl => decl.types.length);
      }
    }

    let onChanges: 'simple' | 'complex';

    if (componentContent.includes('ngOnChanges')) {
      const componentSource = ts.createSourceFile(componentPath, componentContent, ts.ScriptTarget.Latest, true);
      const ngOnChangesDeclaration = tsquery(
        componentSource,
        'MethodDeclaration:has(Identifier[name=ngOnChanges])'
      )[0] as ts.MethodDeclaration;

      if (ngOnChangesDeclaration) {
        if (ngOnChangesDeclaration.parameters.length) {
          onChanges = 'complex';
        } else {
          onChanges = 'simple';
        }
      }
    }

    const operations = [];

    if (!options.ci) {
      operations.push(addDeclarationToNgModule(options));
      operations.push(addExportToNgModule(options));
      operations.push(
        addDecoratorToClass(
          componentPath,
          strings.classify(originalName + 'Component'),
          'GenerateLazyComponent',
          'ish-core/utils/module-loader/generate-lazy-component.decorator'
        )
      );
    }

    operations.push(
      mergeWith(
        apply(url('./files'), [
          applyTemplates({
            ...strings,
            ...options,
            bindings,
            imports,
            originalPath,
            group,
            extension,
            originalName,
            onChanges,
          }),
          move(`/${project.sourceRoot}/app/extensions/${extension}/exports/${group}`),
          forEach(fileEntry => {
            if (host.exists(fileEntry.path)) {
              host.overwrite(fileEntry.path, fileEntry.content);
              // tslint:disable-next-line: no-null-keyword
              return null;
            } else {
              return fileEntry;
            }
          }),
        ])
      )
    );

    if (!options.ci) {
      operations.push(applyLintFix());
    }

    return chain(operations);
  };
}
