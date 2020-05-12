import { strings } from '@angular-devkit/core';
import {
  Rule,
  SchematicsException,
  apply,
  chain,
  filter,
  mergeWith,
  move,
  noop,
  template,
  url,
} from '@angular-devkit/schematics';

import { applyNameAndPath, determineArtifactName, findDeclaringModule, generateSelector } from '../utils/common';
import { applyLintFix } from '../utils/lint-fix';
import { addDeclarationToNgModule, addExportToNgModule } from '../utils/registration';

import { PWAComponentOptionsSchema as Options } from './schema';

export function createComponent(options: Options): Rule {
  return host => {
    if (!options.project) {
      throw new SchematicsException('Option (project) is required.');
    }
    // tslint:disable:no-parameter-reassignment
    options = applyNameAndPath('component', host, options);
    options = determineArtifactName('component', host, options);
    options = generateSelector(host, options);
    options = findDeclaringModule(host, options);

    const operations = [];
    if (!options.skipImport) {
      operations.push(addDeclarationToNgModule(options));
      if (options.export) {
        operations.push(addExportToNgModule(options));
      }
    }
    operations.push(
      mergeWith(
        apply(url('./files'), [
          options.styleFile ? noop() : filter(path => !path.endsWith('.__styleext__')),
          template({
            ...strings,
            ...options,
            'if-flat': s => (options.flat ? '' : s),
          }),
          move(options.path),
        ])
      )
    );

    operations.push(applyLintFix());

    return chain(operations);
  };
}
