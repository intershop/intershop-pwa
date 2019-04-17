import { Rule, SchematicsException, chain, schematic } from '@angular-devkit/schematics';

import { applyNameAndPath, findDeclaringModule, generateSelector } from '../utils/common';

import { PwaContainerComponentPairOptionsSchema as Options } from './schema';

export function createContainerComponentPair(options: Options): Rule {
  return host => {
    if (!options.project) {
      throw new SchematicsException('Option (project) is required.');
    }

    // tslint:disable:no-parameter-reassignment
    options = applyNameAndPath(undefined, host, options);
    options = findDeclaringModule(host, options);

    const childOptions = {
      name: options.name,
      project: options.project,
      path: options.path,
      styleFile: options.styleFile,
      prefix: options.prefix,
    };

    return chain([
      schematic('component', childOptions),
      schematic('container', {
        ...childOptions,
        referenceSelector: generateSelector('component', host, childOptions).selector,
        referenceComponent: options.name,
        referenceComponentPath: `../../components/${options.name}/${options.name}.component`,
        export: true,
      }),
    ]);
  };
}
