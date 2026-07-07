import { Rule, SchematicsException, chain } from '@angular-devkit/schematics';
import { getWorkspace } from '@schematics/angular/utility/workspace';
import { basename, normalize } from 'path';
import { OverrideOptionsSchema as Options } from 'schemas/helpers/override/schema';

function ensureCopyFile(from: string, to: string): Rule {
  return host => {
    if (!host.exists(to)) {
      host.create(to, host.read(from));
    }
  };
}

function updateComponentOverrideResources(componentFile: string, templateUrl?: string, styleUrl?: string): Rule {
  return host => {
    const buffer = host.read(componentFile);
    if (!buffer) {
      throw new SchematicsException(`Could not read ${componentFile}.`);
    }

    let content = buffer.toString();
    if (templateUrl) {
      content = content.replace(/templateUrl:\s*(['"`])\.\/[^'"`]+(['"`])/, `templateUrl: './${templateUrl}'`);
    }

    if (styleUrl) {
      if (/styleUrls:\s*\[[^\]]*\]/s.test(content)) {
        content = content.replace(/styleUrls:\s*\[[^\]]*\]/s, `styleUrls: ['./${styleUrl}']`);
      } else {
        content = content.replace(
          /templateUrl:\s*(['"`])\.\/[^'"`]+(['"`]),?/,
          match => `${match.endsWith(',') ? match : `${match},`}\n  styleUrls: ['./${styleUrl}'],`
        );
      }
    }

    host.overwrite(componentFile, content);
  };
}

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
    const path = normalize(options.path ?? '')
      .replace(/\\/g, '/')
      .replace(/^\./, '');
    let from = normalize(options.from).replace(/\\/g, '/');
    from = `${path ? `${path}/` : !from.startsWith(`${sourceRoot}/app/`) ? `${sourceRoot}/app/` : ''}${from.replace(
      /\/$/,
      ''
    )}`;
    if (!host.exists(from) || !from.endsWith('.ts')) {
      throw new SchematicsException('Input does not point to an existing TypeScript file.');
    }

    if (!options.theme) {
      throw new SchematicsException('Option (theme) is required.');
    }

    if ((options.html || options.scss) && !from.includes('.component.')) {
      throw new SchematicsException('Template and Style overrides only work on components.');
    }

    const operations = [];
    const componentOverride = from.includes('.component.');
    const htmlTarget = from.replace(/([^\\/]+).ts$/, `$1.${options.theme}.html`);
    const scssTarget = from.replace(/([^\\/]+).ts$/, `$1.${options.theme}.scss`);
    const tsTarget = from.replace(/([^\\/]+).ts$/, `$1.${options.theme}.ts`);

    if (options.html) {
      host.create(htmlTarget, 'OVERRIDE');
    }

    if (options.scss) {
      host.create(scssTarget, `/* style definitions for overriding with theme "${options.theme}" */`);
    }

    if (options.ts || ((options.html || options.scss) && componentOverride)) {
      operations.push(
        ensureCopyFile(from, tsTarget),
        updateComponentOverrideResources(
          tsTarget,
          options.html ? basename(htmlTarget) : undefined,
          options.scss ? basename(scssTarget) : undefined
        )
      );
    }

    return chain(operations);
  };
}
