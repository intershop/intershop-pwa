import { Rule } from '@angular-devkit/schematics';
import { ESLint } from 'eslint';
import { existsSync } from 'fs';
import { normalize, sep } from 'path';
import { forkJoin, from } from 'rxjs';
import { mapTo, tap } from 'rxjs/operators';

import { readIntoSourceFile } from './filesystem';

function getRootESLintConfigPath() {
  const p = normalize(process.cwd());
  const segments = p.split(sep);

  let configPath = '';

  for (let i = segments.length; i > 0; i--) {
    const path = segments.slice(0, i).concat('.eslintrc.json').join(sep);
    if (existsSync(path)) {
      configPath = path;
    }
  }
  return configPath;
}

export function applyLintFix(): Rule {
  const eslint = new ESLint({ fix: true, overrideConfigFile: getRootESLintConfigPath() });
  return tree => {
    // Only include files that have been touched.
    const files = tree.actions
      .map(action => action.path.substring(1))
      .filter(path => path.endsWith('.ts') || path.endsWith('.html'))
      .filter((v, i, a) => a.indexOf(v) === i);

    if (files.length)
      return forkJoin(
        files
          .map(filePath => ({ filePath, source: readIntoSourceFile(tree, filePath) }))
          .map(({ source, filePath }) =>
            from(eslint.lintText(source.text, { filePath })).pipe(
              tap(results => {
                if (results[0]?.output) {
                  tree.overwrite(filePath, results[0].output);
                }
              })
            )
          )
      ).pipe(mapTo(tree));
    else return tree;
  };
}
