import { Rule, SchematicsException, Tree, chain, schematic } from '@angular-devkit/schematics';
import { getWorkspace } from '@schematics/angular/utility/workspace';
import * as cp from 'child_process';
import * as path from 'path';
import { PWALazyComponentsOptionsSchema as Options } from 'schemas/helpers/lazy-components/schema';

async function createNewComponents(host: Tree, options: Options) {
  const workspace = await getWorkspace(host);
  const project = workspace.projects.get(options.project);

  const operations: Rule[] = [];

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

  return operations;
}

async function deleteOldComponents() {
  const operations: Rule[] = [];

  if (process.env.CI !== 'true') {
    let gitAvailable = false;
    try {
      cp.execSync('git status');
      gitAvailable = true;
    } catch (error) {
      console.warn('Git is not installed or it is not a Git repository. Skipping deletion.');
    }

    if (gitAvailable) {
      cp.execSync('git clean -dnx')
        .toString()
        .split('\n')
        .map(line => {
          const splits = line.split(/\s/);
          return splits[splits.length - 1];
        })
        .filter(file => path.basename(file)?.startsWith('lazy-'))
        .forEach(file => {
          operations.push(tree => {
            try {
              console.log(tree.get(file));
              tree.delete(file);
            } catch (error) {
              tree.getDir(file).subfiles.forEach(subfile => {
                tree.delete(`${file}/${subfile}`);
              });
            }
          });
        });
    }
  }

  return operations;
}

export function createLazyComponents(options: Options): Rule {
  return async host => {
    if (!options.project) {
      throw new SchematicsException('Option (project) is required.');
    }

    const oldComponents = await deleteOldComponents();

    const newComponents = await createNewComponents(host, options);

    return chain([...oldComponents, ...newComponents]);
  };
}
