import { strings } from '@angular-devkit/core';
import {
  Rule,
  SchematicsException,
  apply,
  chain,
  mergeWith,
  move,
  renameTemplateFiles,
  template,
  url,
} from '@angular-devkit/schematics';
import { buildDefaultPath, getWorkspace } from '@schematics/angular/utility/workspace';

import { applyNameAndPath, detectExtension, determineArtifactName } from '../utils/common';
import { applyLintFix } from '../utils/lint-fix';
import { addExportToNgModule, addImportToNgModule, addImportToNgModuleBefore } from '../utils/registration';

import { PWAExtensionOptionsSchema as Options } from './schema';

export function createExtension(options: Options): Rule {
  return async host => {
    if (!options.project) {
      throw new SchematicsException('Option (project) is required.');
    }
    options = await detectExtension('extension', host, options);
    options = await applyNameAndPath('extension', host, options);
    options = determineArtifactName('extension', host, options);

    const operations: Rule[] = [];
    operations.push(
      mergeWith(
        apply(url('./files'), [
          template({
            ...strings,
            ...options,
          }),
          renameTemplateFiles(),
          move(options.path),
        ])
      )
    );

    const workspace = await getWorkspace(host);
    const project = workspace.projects.get(options.project);
    const projectRoot = buildDefaultPath(project);

    const moduleImportOptions = {
      artifactName: strings.classify(options.name) + 'ExportsModule',
      moduleImportPath: `${projectRoot}/extensions/${strings.dasherize(options.name)}/exports/${strings.dasherize(
        options.name
      )}-exports.module`,
    };

    const sharedModuleOptions = {
      module: `${projectRoot}/shared/shared.module.ts`,
      ...moduleImportOptions,
    };
    operations.push(addExportToNgModule(sharedModuleOptions));
    operations.push(addImportToNgModule(sharedModuleOptions));

    const appModuleOptions = {
      module: `${projectRoot}/app.module.ts`,
      artifactName: strings.classify(options.name) + 'RoutingModule',
      moduleImportPath: `${projectRoot}/extensions/${strings.dasherize(options.name)}/pages/${strings.dasherize(
        options.name
      )}-routing.module`,
    };
    operations.push(addImportToNgModuleBefore(appModuleOptions, 'AppLastRoutingModule'));

    operations.push(applyLintFix());

    return chain(operations);
  };
}
