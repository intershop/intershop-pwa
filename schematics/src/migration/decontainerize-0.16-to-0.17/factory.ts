import { Rule, SchematicsException, Tree, UpdateRecorder } from '@angular-devkit/schematics';
import { tsquery } from '@phenomnomnominal/tsquery';
import * as ts from 'typescript';

import { readIntoSourceFile } from '../../utils/filesystem';

import { Decontainerize as Options } from './schema';

function checkNoCollisions(host: Tree): boolean {
  const moving: { [path: string]: string[] } = {};
  const naming: { [name: string]: string[] } = {};

  host.root.visit(path => {
    if (path.startsWith('/src/app') && (path.endsWith('component.ts') || path.endsWith('container.ts'))) {
      const pathFolder = path.replace(/\/[^/]*$/, '');
      let target = pathFolder.replace(/\/(components|containers)/, '');
      if (target.includes('/shared/')) {
        target = target.replace('/shared/', '/shared/components/');
      }

      moving[target] = moving[target] ? [...moving[target], path.substr(1)] : [path.substr(1)];

      const name = path.replace(/.*\//, '').replace(/\..*/, '');

      naming[name] = naming[name] ? [...naming[name], path.substr(1)] : [path.substr(1)];
    }
  });

  let objections = false;
  Object.keys(moving).forEach(target => {
    if (moving[target].length > 1) {
      console.warn(moving[target], 'will be moved to', target);
      objections = true;
    }
  });
  Object.keys(naming).forEach(target => {
    if (naming[target].length > 1) {
      console.warn(naming[target], 'will have the same name', target);
      objections = true;
    }
  });

  return !objections;
}

function adoptImportStatements(host: Tree, file: string) {
  let update: UpdateRecorder;
  const source = readIntoSourceFile(host, file);
  tsquery(source, 'ImportDeclaration > StringLiteral').forEach(x => {
    const newImport = x
      .getText()
      // .replace(/\/components\//g, '/')
      // .replace(/\/containers\//g, '/')
      .replace(/.container'$/g, ".component'");
    if (newImport !== x.getText()) {
      update = update || host.beginUpdate(file);
      update.remove(x.pos, x.end - x.pos).insertLeft(x.pos, ` ${newImport}`);
    }
  });
  if (update) {
    host.commitUpdate(update);
  }
}

function transformContainerComponentIdentifiers(host: Tree, file: string) {
  let update: UpdateRecorder;
  const source = readIntoSourceFile(host, file);
  tsquery(source, 'Identifier[name=/.*ContainerComponent$/]')
    .filter(x =>
      ['CMSContainerComponent', 'AddressFormContainerComponent', 'CookieLawContainerComponent'].every(
        y => x.getText() !== y
      )
    )
    .forEach(x => {
      update = update || host.beginUpdate(file);
      update.remove(x.end - 18, 9);
    });
  if (update) {
    host.commitUpdate(update);
  }
}

function transformContainerComponentSelectors(host: Tree, file: string) {
  const content = host.read(file).toString();
  const replacement = content.replace(
    /(?!(ish-address-form-container|ish-cms-container))(ish-[a-z-]+)-container/g,
    '$2'
  );
  if (content !== replacement) {
    host.overwrite(file, replacement);
  }
}

function deContainerizeComponentDecorator(host: Tree, file: string) {
  let update: UpdateRecorder;
  const source = readIntoSourceFile(host, file);
  tsquery(source, 'Decorator > CallExpression > Identifier[name="Component"]')
    .map(x => x.parent)
    .forEach((x: ts.CallExpression) => {
      x.arguments.forEach(args => {
        const replacement = args
          .getText()
          .replace('-container', '')
          .replace(/\.container\./g, '.component.');
        if (args.getText() !== replacement) {
          update = update || host.beginUpdate(file);
          update.remove(args.pos, args.end - args.pos).insertLeft(args.pos, replacement);
        }
      });
    });
  if (update) {
    host.commitUpdate(update);
  }
}

export function decontainerize(options: Options): Rule {
  return host => {
    if (!options.project) {
      throw new SchematicsException('Option (project) is required.');
    }

    if (!checkNoCollisions(host)) {
      throw new SchematicsException(
        'Found file naming collisions. Merge or rename mentioned components before retrying.'
      );
    }

    host.root.visit(file => {
      if (/\/e2e\/.*/.test(file)) {
        transformContainerComponentSelectors(host, file);
      }

      if (/\/src\/app\/(shared\/|shell\/|pages\/|extensions\/|app).*/.test(file)) {
        if (file.endsWith('container.ts')) {
          deContainerizeComponentDecorator(host, file);
        }
        adoptImportStatements(host, file);
        transformContainerComponentIdentifiers(host, file);
        transformContainerComponentSelectors(host, file);
        if (file.replace(/.*\//g, '').includes('.container.')) {
          const target = file.replace('.container.', '.component.');
          host.create(target, host.read(file));
          host.delete(file);
        }
      }
    });
  };
}
