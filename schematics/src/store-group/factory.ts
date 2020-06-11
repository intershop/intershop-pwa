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
import { buildDefaultPath, getProject } from '@schematics/angular/utility/project';

import { applyNameAndPath, determineArtifactName } from '../utils/common';
import { applyLintFix } from '../utils/lint-fix';
import { addImportToNgModule } from '../utils/registration';

import { PWAStoreGroupOptionsSchema as Options } from './schema';

function determineStoreGroupLocation(
  host: Tree,
  options: {
    path?: string;
    name?: string;
    project?: string;
  }
) {
  const project = getProject(host, options.project);

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
  return host => {
    if (!options.project) {
      throw new SchematicsException('Option (project) is required.');
    }
    // tslint:disable:no-parameter-reassignment
    options = applyNameAndPath('store', host, options);
    options = determineArtifactName('store', host, options);
    options = determineStoreGroupLocation(host, options);

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
