import { strings } from '@angular-devkit/core';
import { classify } from '@angular-devkit/core/src/utils/strings';
import { Rule, apply, applyTemplates, chain, mergeWith, move, url } from '@angular-devkit/schematics';
import { getWorkspace } from '@schematics/angular/utility/workspace';
import { PWAFieldLibrarySchema as Options } from 'schemas/field-library-configuration/schema';

import { applyLintFix } from '../utils/lint-fix';
import { addTokenProviderToNgModule } from '../utils/registration';

export function createFieldLibraryConfiguration(options: Options): Rule {
  return async host => {
    const workspace = await getWorkspace(host);
    const project = workspace.projects.get(options.project);

    options.path = `/${project.sourceRoot}/app/shared/formly/field-library/configurations`;
    options.module = `/${project.sourceRoot}/app/shared/formly/field-library/field-library.module.ts`;
    options.artifactPath = `/${project.sourceRoot}/app/shared/formly/field-library/configurations/${strings.dasherize(
      options.name
    )}.configuration`;

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
    operations.push(
      addTokenProviderToNgModule({
        ...options,
        token: 'FIELD_LIBRARY_CONFIGURATION',
        class: `${classify(options.name)}Configuration`,
        multi: true,
      })
    );
    operations.push(applyLintFix());

    return chain(operations);
  };
}
