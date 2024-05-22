import { strings } from '@angular-devkit/core';
import {
  Rule,
  SchematicsException,
  apply,
  applyTemplates,
  chain,
  filter,
  mergeWith,
  move,
  url,
} from '@angular-devkit/schematics';
import { PWAComponentOptionsSchema as Options } from 'schemas/component/schema';

import { applyNameAndPath, determineArtifactName, findDeclaringModule, generateSelector } from '../utils/common';
import { applyLintFix } from '../utils/lint-fix';
import { addDeclarationToNgModule, addExportToNgModule } from '../utils/registration';

export function createComponent(options: Options): Rule {
  return async host => {
    if (!options.project) {
      throw new SchematicsException('Option (project) is required.');
    }
    options = await applyNameAndPath('component', host, options);
    options = determineArtifactName('component', host, options);
    options = await generateSelector(host, options);
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
          filter(path => {
            if (path.endsWith('.scss.template')) {
              return options.styleFile;
            } else if (path.endsWith('.spec.ts.template')) {
              return !options.skipTests;
            }
            return true;
          }),
          applyTemplates({
            ...strings,
            ...options,
            'if-flat': (s: unknown) => (options.flat ? '' : s),
          }),
          move(options.path),
        ])
      )
    );

    operations.push(applyLintFix());

    return chain(operations);
  };
}
