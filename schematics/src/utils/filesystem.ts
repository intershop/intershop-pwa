import { Rule, SchematicsException, Tree } from '@angular-devkit/schematics';
import { existsSync } from 'fs';
import { once } from 'lodash';
import { dirname, join, normalize } from 'path';
import * as ts from 'typescript';

export function readIntoSourceFile(host: Tree, modulePath: string): ts.SourceFile {
  const text = host.read(modulePath);
  // eslint-disable-next-line unicorn/no-null
  if (text === null) {
    throw new SchematicsException(`File ${modulePath} does not exist.`);
  }
  const sourceText = text.toString('utf-8');

  return ts.createSourceFile(modulePath, sourceText, ts.ScriptTarget.Latest, true);
}

export function copyFile(from: string, to: string): Rule {
  return host => {
    host.create(to, host.read(from));
  };
}

export const findProjectRoot = once(() => {
  let projectRoot = normalize(process.cwd());

  while (!existsSync(join(projectRoot, 'angular.json'))) {
    if (dirname(projectRoot) === projectRoot) {
      throw new Error('cannot determine project root');
    }
    projectRoot = dirname(projectRoot);
  }
  return projectRoot;
});
