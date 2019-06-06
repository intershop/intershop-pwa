import { strings } from '@angular-devkit/core';
import { Rule, SchematicsException, apply, mergeWith, move, template, url } from '@angular-devkit/schematics';
import { getProject } from '@schematics/angular/utility/project';

import { PwaKubernetesDeploymentOptionsSchema as Options } from './schema';

export function createKubernetesDeployment(options: Options): Rule {
  return host => {
    if (!options.project) {
      throw new SchematicsException('Option (project) is required.');
    }
    const projectRoot = getProject(host, options.project).root;

    return mergeWith(
      apply(url('./files'), [
        template({
          ...strings,
          ...options,
        }),
        move(projectRoot),
      ])
    );
  };
}
