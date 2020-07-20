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

import { applyNameAndPath, detectExtension, determineArtifactName } from '../utils/common';
import { applyLintFix } from '../utils/lint-fix';

import { PWAServiceOptionsSchema as Options } from './schema';

export function createService(options: Options): Rule {
  return async host => {
    if (!options.project) {
      throw new SchematicsException('Option (project) is required.');
    }
    options = await detectExtension('service', host, options);
    options = await applyNameAndPath('service', host, options);
    options = determineArtifactName('service', host, options);

    const operations: Rule[] = [];

    operations.push(
      mergeWith(
        apply(url('./files'), [
          applyTemplates({
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
