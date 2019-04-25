import { strings } from '@angular-devkit/core';
import { Rule, SchematicsException, apply, chain, mergeWith, move, template, url } from '@angular-devkit/schematics';

import { applyNameAndPath, detectExtension, determineArtifactName, findDeclaringModule } from '../utils/common';
import { addDeclarationToNgModule, addExportToNgModule, addProviderToNgModule } from '../utils/registration';

import { PwaPipeOptionsSchema as Options } from './schema';

export function createPipe(options: Options): Rule {
  return host => {
    if (!options.project) {
      throw new SchematicsException('Option (project) is required.');
    }
    // tslint:disable:no-parameter-reassignment
    options = detectExtension('pipe', host, options);
    options = applyNameAndPath('pipe', host, options);
    options = determineArtifactName('pipe', host, options);

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
          template({
            ...strings,
            ...options,
          }),
          move(options.path),
        ])
      )
    );

    return chain(operations);
  };
}
