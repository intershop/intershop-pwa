import { strings } from '@angular-devkit/core';
import { Rule, SchematicsException, apply, mergeWith, move, template, url } from '@angular-devkit/schematics';

import { applyNameAndPath, detectExtension, determineArtifactName } from '../utils/common';

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

    return mergeWith(
      apply(url('./files'), [
        template({
          ...strings,
          ...options,
        }),
        move(options.path),
      ])
    );
  };
}
