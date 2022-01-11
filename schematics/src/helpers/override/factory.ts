import { Rule, SchematicsException, chain } from '@angular-devkit/schematics';
import { getWorkspace } from '@schematics/angular/utility/workspace';

import { copyFile } from '../../utils/filesystem';
import { setStyleUrls } from '../../utils/registration';

import { OverrideOptionsSchema as Options } from './schema';

export function override(options: Options): Rule {
  // eslint-disable-next-line complexity
  return async host => {
    if (!options.project) {
      throw new SchematicsException('Option (project) is required.');
    }

    if (!options.from) {
      throw new SchematicsException('Option (from) is required.');
    }

    const workspace = await getWorkspace(host);
    const project = workspace.projects.get(options.project);
    const sourceRoot = project.sourceRoot;
    const from = `${
      options.path ? `${options.path}/` : !options.from?.startsWith(`${sourceRoot}/app/`) ? `${sourceRoot}/app/` : ''
    }${options.from.replace(/\/$/, '')}`;
    if (!host.exists(from) || !from.endsWith('.ts')) {
      throw new SchematicsException('Input does not point to an existing TypeScript file.');
    }

    if (!options.theme) {
      throw new SchematicsException('Option (theme) is required.');
    }

    if ((options.html || options.scss) && !from.includes('.component.')) {
      throw new SchematicsException('Template and Style overrides only work on components.');
    }

    if (options.html) {
      const target = from.replace(/([^\\\/]+).ts$/, `$1.${options.theme}.html`);
      host.create(target, 'OVERRIDE');
    }

    const operations = [];

    if (options.scss) {
      const originalScss = from.replace(/([^\\\/]+).ts$/, '$1.scss');
      if (!host.exists(originalScss)) {
        host.create(originalScss, '/* empty file for overriding with file replacements */');
        operations.push(setStyleUrls(from, [originalScss]));
      }

      const target = from.replace(/([^\\\/]+).ts$/, `$1.${options.theme}.scss`);
      host.create(target, `/* style definitions for overriding with theme "${options.theme}" */`);
    }

    if (options.ts) {
      const target = from.replace(/([^\\\/]+).ts$/, `$1.${options.theme}.ts`);
      operations.push(copyFile(from, target));
    }

    return chain(operations);
  };
}
