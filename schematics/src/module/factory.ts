import { strings } from '@angular-devkit/core';
import { Rule, SchematicsException, apply, mergeWith, move, template, url } from '@angular-devkit/schematics';

import { applyNameAndPath, determineArtifactName } from '../utils/common';

import { PwaModuleOptionsSchema as Options } from './schema';

export function createModule(options: Options): Rule {
  return host => {
    if (!options.project) {
      throw new SchematicsException('Option (project) is required.');
    }
    // tslint:disable:no-parameter-reassignment
    options = applyNameAndPath('module', host, options);
    options = determineArtifactName('module', host, options);

    return mergeWith(
      apply(url('./files'), [
        template({
          ...strings,
          ...options,
          'if-flat': s => (options.flat ? '' : s),
        }),
        move(options.path),
      ])
    );
  };
}
