import { Rule, SchematicsException, chain, schematic } from '@angular-devkit/schematics';
import { getWorkspace } from '@schematics/angular/utility/workspace';

import { PWALazyComponentsOptionsSchema as Options } from './schema';

export function createLazyComponents(options: Options): Rule {
  return async host => {
    if (!options.project) {
      throw new SchematicsException('Option (project) is required.');
    }
    const workspace = await getWorkspace(host);
    const project = workspace.projects.get(options.project);
    const operations = [];

    const extensionsRoot = `/${project.sourceRoot}/app/extensions`;
    host.getDir(extensionsRoot).subdirs.forEach(extension => {
      const sharedComponentFolder = `${extensionsRoot}/${extension}/shared`;
      const extensionComponents = host.getDir(sharedComponentFolder).subdirs;

      if (extensionComponents.length) {
        host.getDir(sharedComponentFolder).visit(file => {
          if (file.endsWith('.component.ts')) {
            const componentContent = host.read(file).toString('utf-8');
            if (componentContent.includes('@GenerateLazyComponent')) {
              operations.push(schematic('lazy-component', { ...options, path: file.replace(/.*\/src\/app\//, '') }));
            }
          }
        });
      }
    });

    return chain(operations);
  };
}
