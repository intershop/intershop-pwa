import { strings } from '@angular-devkit/core';
import { Rule, SchematicsException, apply, mergeWith, move, template, url } from '@angular-devkit/schematics';
import { getProject } from '@schematics/angular/utility/project';

import { PwaAzurePipelineOptionsSchema as Options } from './schema';

export function createAzurePipeline(options: Options): Rule {
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
