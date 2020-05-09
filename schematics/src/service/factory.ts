import { strings } from '@angular-devkit/core';
import { Rule, SchematicsException, apply, chain, mergeWith, move, template, url } from '@angular-devkit/schematics';

import { applyNameAndPath, detectExtension, determineArtifactName } from '../utils/common';
import { applyLintFix } from '../utils/lint-fix';

import { PwaServiceOptionsSchema as Options } from './schema';

export function createService(options: Options): Rule {
  return host => {
    if (!options.project) {
      throw new SchematicsException('Option (project) is required.');
    }
    // tslint:disable:no-parameter-reassignment
    options = detectExtension('service', host, options);
    options = applyNameAndPath('service', host, options);
    options = determineArtifactName('service', host, options);

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

    operations.push(applyLintFix());

    return chain(operations);
  };
}
