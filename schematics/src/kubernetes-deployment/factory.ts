import { strings } from '@angular-devkit/core';
import { Rule, SchematicsException, apply, mergeWith, move, template, url } from '@angular-devkit/schematics';
import { getWorkspace } from '@schematics/angular/utility/workspace';

import { PWAKubernetesDeploymentOptionsSchema as Options } from './schema';

export function createKubernetesDeployment(options: Options): Rule {
  return async host => {
    if (!options.project) {
      throw new SchematicsException('Option (project) is required.');
    }
    const workspace = await getWorkspace(host);
    const project = workspace.projects.get(options.project);
    const projectRoot = project.root;

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
