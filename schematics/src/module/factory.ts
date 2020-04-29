import { strings } from '@angular-devkit/core';
import { Rule, SchematicsException, apply, chain, mergeWith, move, template, url } from '@angular-devkit/schematics';

import { applyNameAndPath, determineArtifactName } from '../utils/common';
import { applyLintFix } from '../utils/lint-fix';

import { PWAModuleOptionsSchema as Options } from './schema';

export function createModule(options: Options): Rule {
  return host => {
    if (!options.project) {
      throw new SchematicsException('Option (project) is required.');
    }
    // tslint:disable:no-parameter-reassignment
    options = applyNameAndPath('module', host, options);
    options = determineArtifactName('module', host, options);

    const operations: Rule[] = [];

    operations.push(
      mergeWith(
        apply(url('./files'), [
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
