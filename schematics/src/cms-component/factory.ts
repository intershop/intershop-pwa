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
import {
  addDeclarationToNgModule,
  addEntryComponentToNgModule,
  addImportToFile,
  addProviderToNgModule,
} from '../utils/registration';

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
    if (!options.noCMSPrefixing) {
      options.name = 'cms-' + options.name;
    }
    options = determineArtifactName('component', host, options);
    if (!options.noCMSPrefixing) {
      options.artifactName = 'CMS' + options.artifactName.replace('Cms', '');
    }
    options = generateSelector(host, options);
    options.module = 'shared/shared.module';
    options = findDeclaringModule(host, options);

    const operations = [];
    operations.push(addDeclarationToNgModule(options));
    operations.push(addEntryComponentToNgModule(options));

    let cmModuleOptions = { ...options, module: 'shared/cms/cms.module' };
    cmModuleOptions = findDeclaringModule(host, cmModuleOptions);

    operations.push(addImportToFile(cmModuleOptions));
    operations.push(
      addProviderToNgModule({
        module: cmModuleOptions.module,
        artifactName: `{
      provide: CMS_COMPONENT,
      useValue: {
        definitionQualifiedName: '${options.definitionQualifiedName}',
        class: ${options.artifactName},
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
