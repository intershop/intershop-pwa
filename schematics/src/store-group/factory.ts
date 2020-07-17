import { normalize, strings } from '@angular-devkit/core';
import {
  Rule,
  SchematicsException,
  Tree,
  apply,
  applyTemplates,
  chain,
  mergeWith,
  move,
  url,
} from '@angular-devkit/schematics';
import { buildDefaultPath, getWorkspace } from '@schematics/angular/utility/workspace';

import { applyNameAndPath, determineArtifactName } from '../utils/common';
import { applyLintFix } from '../utils/lint-fix';
import { addImportToNgModule } from '../utils/registration';

import { PWAStoreGroupOptionsSchema as Options } from './schema';

async function determineStoreGroupLocation(
  host: Tree,
  options: {
    path?: string;
    name?: string;
    project?: string;
  }
) {
  const workspace = await getWorkspace(host);
  const project = workspace.projects.get(options.project);

  const path = normalize(`${buildDefaultPath(project)}/core/store/`);
  const module = normalize(`${buildDefaultPath(project)}/core/state-management.module.ts`);
  const artifactName = `${strings.classify(options.name)}StoreModule`;
  const moduleImportPath = normalize(
    `${path}/${strings.dasherize(options.name)}/${strings.dasherize(options.name)}-store.module`
  );

  return {
    ...options,
    path,
    module,
    artifactName,
    moduleImportPath,
  };
}

export function createStoreGroup(options: Options): Rule {
  return async host => {
    if (!options.project) {
      throw new SchematicsException('Option (project) is required.');
    }
    options = await applyNameAndPath('store', host, options);
    options = determineArtifactName('store', host, options);
    options = await determineStoreGroupLocation(host, options);

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

    operations.push(addImportToNgModule(options));

    operations.push(applyLintFix());

    return chain(operations);
  };
}
