import { strings } from '@angular-devkit/core';
import {
  Rule,
  SchematicsException,
  apply,
  applyTemplates,
  chain,
  mergeWith,
  move,
  url,
} from '@angular-devkit/schematics';

import { applyNameAndPath, determineArtifactName } from '../utils/common';
import { applyLintFix } from '../utils/lint-fix';

import { PWAModuleOptionsSchema as Options } from './schema';

export function createModule(options: Options): Rule {
  return async host => {
    if (!options.project) {
      throw new SchematicsException('Option (project) is required.');
    }
    options = await applyNameAndPath('module', host, options);
    options = determineArtifactName('module', host, options);

    const operations: Rule[] = [];

    operations.push(
      mergeWith(
        apply(url('./files'), [
          applyTemplates({
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
