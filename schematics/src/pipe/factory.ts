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
import { PWAPipeOptionsSchema as Options } from 'schemas/pipe/schema';

import {
  applyNameAndPath,
  detectExtension,
  determineArtifactName,
  findDeclaringModule,
  generateSelector,
} from '../utils/common';
import { applyLintFix } from '../utils/lint-fix';
import { addDeclarationToNgModule, addExportToNgModule, addProviderToNgModule } from '../utils/registration';

export function createPipe(options: Options): Rule {
  return async host => {
    if (!options.project) {
      throw new SchematicsException('Option (project) is required.');
    }
    options = await detectExtension('pipe', host, options);
    options = await applyNameAndPath('pipe', host, options);
    options = determineArtifactName('pipe', host, options);
    options = await generateSelector(host, options);

    if (!options.extension) {
      options.module = `core/pipes.module`;
    } else {
      options.module = `extensions/${options.extension}/${options.extension}.module`;
    }
    options = findDeclaringModule(host, options);

    const operations = [];
    if (!options.skipImport) {
      operations.push(addDeclarationToNgModule(options));
      operations.push(addExportToNgModule(options));
      operations.push(addProviderToNgModule(options));
    }
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
