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
  noop,
  url,
} from '@angular-devkit/schematics';

import { applyNameAndPath, detectExtension, determineArtifactName } from '../utils/common';
import { applyLintFix } from '../utils/lint-fix';

import { PWAModelOptionsSchema as Options } from './schema';

export function createModel(options: Options): Rule {
  return host => {
    if (!options.project) {
      throw new SchematicsException('Option (project) is required.');
    }
    // tslint:disable:no-parameter-reassignment
    options = detectExtension('model', host, options);
    options = applyNameAndPath('model', host, options);
    options = determineArtifactName('model', host, options);

    const operations: Rule[] = [];

    operations.push(
      mergeWith(
        apply(url('./files'), [
          !options.simple ? noop() : filter(path => path.includes('model.ts')),
          applyTemplates({ ...strings, ...options }),
          move(options.path),
        ])
      )
    );

    operations.push(applyLintFix());

    return chain(operations);
  };
}
