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
  schematic,
  url,
} from '@angular-devkit/schematics';
import { tsquery } from '@phenomnomnominal/tsquery';
import { getWorkspace } from '@schematics/angular/utility/workspace';
import { PWALazyComponentOptionsSchema as Options } from 'schemas/lazy-component/schema';
import * as ts from 'typescript';

import { determineArtifactName, findDeclaringModule } from '../utils/common';
import { applyLintFix } from '../utils/lint-fix';
import {
  addDeclarationToNgModule,
  addDecoratorToClass,
  addExportToBarrelFile,
  addExportToNgModule,
  generateGitignore,
  updateModule,
} from '../utils/registration';

export function createLazyComponent(options: Options): Rule {
  // eslint-disable-next-line complexity
  return async host => {
    if (!options.project) {
      throw new SchematicsException('Option (project) is required.');
    }
    const workspace = await getWorkspace(host);
    const isProject = options.path.startsWith('projects/');
    const isShared = options.path.startsWith('src/app/shared/');
    const originalPath = options.path.replace(/.*src\/app\//, '');
    const extension = originalPath.split('/')[1];
    const declaringModule = isShared ? 'shared' : isProject ? options.path.split('/')[1] : extension;
    const project = workspace.projects.get(isProject ? options.path.split('/')[1] : options.project);

    const componentPath = `/${project.sourceRoot}/app/${originalPath}`;

    if (
      !originalPath.endsWith('component.ts') ||
      !(originalPath.startsWith('extensions/') || isProject || isShared) ||
      !host.exists(componentPath)
    ) {
      throw new SchematicsException(
        'path does not point to an existing component in an extension, project or shared module'
      );
    }

    const originalName = /\/([a-z0-9-]+)\.component\.ts/.exec(originalPath)[1];
    options.name = `lazy-${originalName}`;
    if (isProject) {
      options.path = `${project.sourceRoot}/app/exports`;
    } else if (isShared) {
      options.path = `${project.sourceRoot}/app/shell/shared`;
    } else {
      options.path = `${project.sourceRoot}/app/extensions/${extension}/exports`;
    }
    options = findDeclaringModule(host, options);
    options = determineArtifactName('component', host, options);

    let inputNames: string[] = [];

    const componentContent = host.read(componentPath).toString('utf-8');
    const componentSource = ts.createSourceFile(componentPath, componentContent, ts.ScriptTarget.Latest, true);

    const selectorPropertyAssignment = tsquery(
      componentSource,
      'CallExpression:has(Identifier[name=Component]) PropertyAssignment:has(Identifier[name=selector])'
    )[0] as ts.PropertyAssignment;
    options.selector = selectorPropertyAssignment.initializer
      .getText()
      .replace(/'/g, '')
      .replace(originalName.replace(`${project.prefix}-`, ''), options.name.replace(`${project.prefix}-`, ''));

    if (componentContent.includes('@Input(')) {
      inputNames = tsquery(componentSource, 'PropertyDeclaration:has(Decorator Identifier[text=Input])').map(
        (node: ts.PropertyDeclaration) => node.name.getText()
      );
    }

    let onChanges: 'simple' | 'complex';

    if (componentContent.includes('ngOnChanges')) {
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
    const exportsModuleName = `${declaringModule}-exports`;
    const exportsModuleExists = host.exists(`/${options.path}/${exportsModuleName}.module.ts`);

    const gitignoreExists = host.exists(`/${options.path}/.gitignore`);

    let componentImportPath: string;
    if (isProject) {
      componentImportPath = '../../components';
    } else if (isShared) {
      const pathFragments = originalPath.split('/');
      pathFragments.pop();
      pathFragments.pop();
      componentImportPath = `../../../${pathFragments.join('/')}`;
    } else {
      componentImportPath = '../../shared';
    }

    const operations = [];

    if (process.env.CI !== 'true') {
      if (!isShared && !exportsModuleExists) {
        operations.push(
          schematic('module', {
            project: options.project,
            name: exportsModuleName,
            flat: true,
          })
        );
        operations.push(updateModule(options));
        operations.push(
          addExportToBarrelFile({
            path: options.path,
            artifactName: strings.classify(`${exportsModuleName}-module`),
            moduleImportPath: `/${options.path}/${exportsModuleName}.module`,
          })
        );
      }
      operations.push(addDeclarationToNgModule(options));
      if (!isShared) {
        operations.push(addExportToNgModule(options));
      }
      if (!gitignoreExists) {
        operations.push(generateGitignore({ path: options.path, content: '**/lazy*\n' }));
      }

      if (isProject) {
        operations.push(addExportToBarrelFile(options));
      }
      operations.push(
        addDecoratorToClass(
          componentPath,
          strings.classify(`${originalName}Component`),
          'GenerateLazyComponent',
          'ish-core/utils/module-loader/generate-lazy-component.decorator'
        )
      );
    }

    const guardDisplay = !isProject && !isShared && extension;

    operations.push(
      mergeWith(
        apply(url('./files'), [
          applyTemplates({
            ...strings,
            ...options,
            inputNames,
            originalPath,
            originalName,
            onChanges,
            isShared,
            guardDisplay,
            componentImportPath,
            declaringModule,
          }),
          move(options.path),
          forEach(fileEntry => {
            if (host.exists(fileEntry.path)) {
              host.overwrite(fileEntry.path, fileEntry.content);
              // eslint-disable-next-line unicorn/no-null
              return null;
            } else {
              return fileEntry;
            }
          }),
        ])
      )
    );

    if (guardDisplay) {
      operations.push(schematic('add-destroy', { project: options.project, name: `${options.path}/${options.name}` }));
    }

    operations.push(applyLintFix());

    return chain(operations);
  };
}
