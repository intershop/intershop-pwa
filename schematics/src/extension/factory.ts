import { strings } from '@angular-devkit/core';
import { Rule, SchematicsException, apply, chain, mergeWith, move, template, url } from '@angular-devkit/schematics';
import { buildDefaultPath, getProject } from '@schematics/angular/utility/project';

import { applyNameAndPath, detectExtension, determineArtifactName } from '../utils/common';
import { addExportToNgModule, addImportToNgModule, addImportToNgModuleBefore } from '../utils/registration';

import { PwaExtensionOptionsSchema as Options } from './schema';

export function createExtension(options: Options): Rule {
  return host => {
    if (!options.project) {
      throw new SchematicsException('Option (project) is required.');
    }
    // tslint:disable:no-parameter-reassignment
    options = detectExtension('extension', host, options);
    options = applyNameAndPath('extension', host, options);
    options = determineArtifactName('extension', host, options);

    const operations: Rule[] = [];
    operations.push(
      mergeWith(
        apply(url('./files'), [
          template({
            ...strings,
            ...options,
          }),
          move(options.path),
        ])
      )
    );
    const projectRoot = buildDefaultPath(getProject(host, options.project));

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

    const shellModuleOptions = {
      module: `${projectRoot}/shell/shell.module.ts`,
      ...moduleImportOptions,
    };
    operations.push(addImportToNgModule(shellModuleOptions));

    const appModuleOptions = {
      module: `${projectRoot}/app.module.ts`,
      artifactName: strings.classify(options.name) + 'RoutingModule',
      moduleImportPath: `${projectRoot}/extensions/${strings.dasherize(options.name)}/pages/${strings.dasherize(
        options.name
      )}-routing.module`,
    };
    operations.push(addImportToNgModuleBefore(appModuleOptions, 'AppLastRoutingModule'));

    return chain(operations);
  };
}
