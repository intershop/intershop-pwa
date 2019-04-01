import { strings } from '@angular-devkit/core';
import {
  Rule,
  SchematicsException,
  apply,
  chain,
  filter,
  mergeWith,
  move,
  noop,
  template,
  url,
} from '@angular-devkit/schematics';

import {
  applyNameAndPath,
  detectExtension,
  determineArtifactName,
  findDeclaringModule,
  generateSelector,
} from '../utils/common';
import { addDeclarationToNgModule, addEntryComponentToNgModule, addProviderToNgModule } from '../utils/registration';

import { PwaCmsComponentOptionsSchema as Options } from './schema';

export function createCMSComponent(options: Options): Rule {
  return host => {
    if (!options.project) {
      throw new SchematicsException('Option (project) is required.');
    } else if (!options.definitionQualifiedName) {
      throw new SchematicsException('Option (definitionQualifiedName) is required.');
    }
    // tslint:disable:no-parameter-reassignment
    options = detectExtension('cms', host, options);
    options = applyNameAndPath('component', host, options);
    options = determineArtifactName('component', host, options);
    options = generateSelector('component', host, options);
    options.module = 'cms/cms.module';
    options = findDeclaringModule(host, options);

    // tslint:disable-next-line:no-string-literal
    const artifactName = options['artifactName'];

    const operations = [];
    operations.push(addDeclarationToNgModule(options));
    operations.push(addEntryComponentToNgModule(options));
    operations.push(
      addProviderToNgModule({
        module: options.module,
        artifactName: `{
      provide: CMS_COMPONENT,
      useValue: {
        definitionQualifiedName: '${options.definitionQualifiedName}',
        class: ${artifactName},
      },
      multi: true,
    }`,
      })
    );
    operations.push(
      mergeWith(
        apply(url('./files'), [
          options.styleFile ? noop() : filter(path => !path.endsWith('.__styleext__')),
          template({
            ...strings,
            ...options,
            'if-flat': s => (options.flat ? '' : s),
          }),
          move(options.path),
        ])
      )
    );

    return chain(operations);
  };
}
