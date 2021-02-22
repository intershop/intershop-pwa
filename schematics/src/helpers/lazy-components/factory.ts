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

    const fileVisitor = (file: string) => {
      if (file.endsWith('.component.ts')) {
        const componentContent = host.read(file).toString('utf-8');
        if (componentContent.includes('@GenerateLazyComponent')) {
          operations.push(schematic('lazy-component', { ...options, path: file.substring(1) }));
        }
      }
      try {
        host.getDir(file).visit(fileVisitor);
      } catch (err) {
        // do nothing
      }
    };

    const extensionsRoot = `/${project.sourceRoot}/app/extensions`;
    host.getDir(extensionsRoot).subdirs.forEach(extension => {
      const sharedComponentFolder = `${extensionsRoot}/${extension}/shared`;
      host.getDir(sharedComponentFolder).visit(fileVisitor);
    });

    const projectsRoot = `/projects`;
    host.getDir(projectsRoot).subdirs.forEach(projectName => {
      const sharedComponentFolder = `${projectsRoot}/${projectName}/src/app/components`;
      host.getDir(sharedComponentFolder).visit(fileVisitor);
    });

    const sharedRoot = `/src/app/shared`;
    host.getDir(sharedRoot).visit(fileVisitor);

    return chain(operations);
  };
}
