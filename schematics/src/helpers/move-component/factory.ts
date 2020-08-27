import { strings } from '@angular-devkit/core';
import { Rule, SchematicsException } from '@angular-devkit/schematics';
import { tsquery } from '@phenomnomnominal/tsquery';
import * as ts from 'typescript';

import { readIntoSourceFile } from '../../utils/filesystem';

import { MoveComponentOptionsSchema as Options } from './schema';

function similarIdx(str1: string, str2: string) {
  for (let index = 0; index < Math.min(str1.length, str2.length); index++) {
    if (str1[index] !== str2[index]) {
      return index;
    }
  }
  return 0;
}

function getAbsolutePath(base: string, rel: string): string {
  if (rel.startsWith('..')) {
    const myPath = base.split('/');
    myPath.pop();
    const otherPath = rel.split('/').reverse();
    while (otherPath.length && otherPath[otherPath.length - 1] === '..') {
      otherPath.pop();
      myPath.pop();
    }
    for (const el of otherPath.reverse()) {
      myPath.push(el);
    }
    return myPath.join('/');
  }
}

function getRelativePath(base: string, abs: string): string {
  const basePath = base.split('/');
  basePath.pop();
  const absPath = abs.split('/');

  while (basePath[0] === absPath[0]) {
    basePath.shift();
    absPath.shift();
  }

  while (basePath.length) {
    basePath.pop();
    absPath.splice(0, 0, '..');
  }

  return absPath.join('/');
}

export function move(options: Options): Rule {
  return async host => {
    if (!options.project) {
      throw new SchematicsException('Option (project) is required.');
    }

    if (!options.from) {
      throw new SchematicsException('Option (from) is required.');
    }

    if (!options.to) {
      throw new SchematicsException('Option (to) is required.');
    }

    const from = options.from.replace(/\/$/, '');
    host.getDir(from);
    const to = options.to.replace(/\/$/, '');

    const renames = [];

    const fromName = from.replace(/.*\//, '');
    const fromClassName = strings.classify(fromName) + 'Component';
    const toName = to.replace(/.*\//, '');
    if (toName.includes('.')) {
      throw new SchematicsException(`target must be a directory`);
    }

    const toClassName = strings.classify(toName) + 'Component';

    const similarIndex = Math.min(similarIdx(from, to), from.lastIndexOf('/') + 1, to.lastIndexOf('/') + 1);

    const replacePath = (path: string) =>
      path
        .replace(from.substr(similarIndex), to.substr(similarIndex))
        .replace(fromName + '.component', toName + '.component');

    const replaceImportPath = (file: string, path: string) => {
      const newPath = replacePath(path);
      if (path !== newPath) {
        return newPath;
      } else if (path.includes('..')) {
        const match = /(\.\.[\w\/\.\-]+)/.exec(path);
        if (match) {
          const fromRelative = match[0];
          const fromAbsolute = getAbsolutePath(file, fromRelative);
          const toAbsolute = replacePath(fromAbsolute);
          const potentiallyMovedFile = replacePath(file);
          const toRelative = getRelativePath(potentiallyMovedFile, toAbsolute);
          return path.replace(fromRelative, toRelative);
        }
      }
      return newPath;
    };
    console.log('moving', options.from, '\n    to', options.to);

    host.visit(file => {
      if (file.startsWith(`/src/app/`) || file.startsWith(`/projects/`)) {
        if (file.includes(from + '/')) {
          renames.push([file, replacePath(file)]);

          if (fromName !== toName && file.endsWith('.component.ts')) {
            updateComponentDecorator(host, file, fromName, toName);
          }
        }
        if (file.endsWith('.ts')) {
          if (fromClassName !== toClassName) {
            updateComponentClassName(host, file, fromClassName, toClassName);
          }

          const imports = tsquery(
            readIntoSourceFile(host, file),
            file.includes(fromName) ? `ImportDeclaration` : `ImportDeclaration[text=/.*${fromName}.*/]`
          ).filter((x: ts.ImportDeclaration) => file.includes(fromName) || x.getText().includes(`/${fromName}/`));
          if (imports.length) {
            const updates: { node: ts.Node; replacement: string }[] = [];
            imports.forEach(importDeclaration => {
              tsquery(importDeclaration, 'StringLiteral').forEach(node => {
                const replacement = replaceImportPath(file, node.getFullText());
                if (node.getFullText() !== replacement) {
                  updates.push({ node, replacement });
                }
              });
            });
            if (updates.length) {
              const updater = host.beginUpdate(file);
              updates.forEach(({ node, replacement }) => {
                updater.remove(node.pos, node.end - node.pos).insertLeft(node.pos, replacement);
              });
              host.commitUpdate(updater);
            }
          }
        } else if (fromName !== toName && file.endsWith('.html')) {
          updateComponentSelector(host, file, fromName, toName);
        }
      }
    });

    renames.forEach(([source, target]) => {
      host.create(target, host.read(source));
      host.delete(source);
    });
  };
}

export function updateComponentSelector(host, file, fromName: string, toName: string, includePrefix: boolean = true) {
  const content = host.read(file).toString();
  const replacement = content.replace(
    new RegExp(`(?!.*${fromName}[a-z-]+.*)ish-${fromName}`, 'g'),
    (includePrefix ? 'ish-' : '') + toName
  );
  if (content !== replacement) {
    host.overwrite(file, replacement);
  }
}

export function updateComponentClassName(host, file, fromClassName: string, toClassName: string) {
  const identifiers = tsquery(readIntoSourceFile(host, file), `Identifier[name=${fromClassName}]`);
  if (identifiers.length) {
    const updater = host.beginUpdate(file);
    identifiers.forEach(x =>
      updater.remove(x.pos, x.end - x.pos).insertLeft(x.pos, x.getFullText().replace(fromClassName, toClassName))
    );
    host.commitUpdate(updater);
  }
}

export function updateComponentDecorator(host, file, fromName: string, toName: string) {
  const updater = host.beginUpdate(file);
  tsquery(readIntoSourceFile(host, file), 'Decorator Identifier[name=Component]')
    .map(x => x.parent)
    .forEach(componentDecorator => {
      tsquery(componentDecorator, 'PropertyAssignment')
        .map((pa: ts.PropertyAssignment) => pa.initializer)
        .forEach(x => {
          updater.remove(x.pos, x.end - x.pos).insertLeft(x.pos, x.getFullText().replace(fromName, toName));
        });
    });
  host.commitUpdate(updater);
}
