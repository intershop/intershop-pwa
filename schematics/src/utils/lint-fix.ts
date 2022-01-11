import { Rule } from '@angular-devkit/schematics';
import { ESLint } from 'eslint';
import { existsSync } from 'fs';
import { normalize, sep } from 'path';
import { forkJoin, from } from 'rxjs';
import { mapTo, tap } from 'rxjs/operators';

import { readIntoSourceFile } from './filesystem';

function getRootConfigPath() {
  const p = normalize(process.cwd());
  const segments = p.split(sep);
  console.log(segments);

  let configPath = '';

  for (let i = segments.length; i > 0; i--) {
    const path = segments.slice(0, i).concat('.eslintrc.json').join(sep);
    console.log('path ', i, path);
    if (existsSync(path)) {
      console.log(path, ' exists');
      configPath = path;
    }
  }
  return configPath;
}

const eslint = new ESLint({ fix: true, overrideConfigFile: getRootConfigPath() });

export function applyLintFix(): Rule {
  return tree => {
    const label = 'lint';
    console.time(label);
    console.timeLog(label, 'start');
    // Only include files that have been touched.
    const files = tree.actions
      .map(action => action.path.substring(1))
      .filter(path => path.endsWith('.ts') || path.endsWith('.html'))
      .filter((v, i, a) => a.indexOf(v) === i);

    console.timeLog(label, 'lint', files);

    if (files.length)
      return forkJoin(
        files
          .map(filePath => ({ filePath, source: readIntoSourceFile(tree, filePath) }))
          .map(({ source, filePath }) =>
            from(eslint.lintText(source.text, { filePath })).pipe(
              tap(results => {
                if (results[0]?.output) {
                  tree.overwrite(filePath, results[0].output);
                } else if (results[0]) {
                  console.log('res:', results[0].messages);
                }
              })
            )
          )
      ).pipe(
        mapTo(tree),
        tap(() => {
          console.timeEnd(label);
        })
      );
    else return tree;
  };
}
