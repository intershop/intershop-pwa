import { Rule } from '@angular-devkit/schematics';
import { ESLint } from 'eslint';
import { existsSync } from 'fs';
import { normalize, sep } from 'path';
import { from } from 'rxjs';
import { map } from 'rxjs/operators';

import { readIntoSourceFile } from './filesystem';

export function applyLintFix(): Rule {
  return tree => {
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

    // Only include files that have been touched.
    const files = Array.from(
      tree.actions.reduce((acc: Set<string>, action) => {
        const path = action.path.substr(1); // Remove the starting '/'.
        if (path.endsWith('.ts') || path.endsWith('.html')) {
          acc.add(path);
        }

        return acc;
      }, new Set<string>())
    );
    const rootConfigPath = getRootConfigPath();
    const eslint = new ESLint({ fix: true, overrideConfigFile: rootConfigPath });

    return from(
      Promise.all(
        files.map(file => {
          const source = readIntoSourceFile(tree, file);
          return eslint.lintText(source.text, { filePath: file }).then(results => {
            if (results[0]?.output) {
              tree.overwrite(file, results[0].output);
            } else if (results[0]) {
              console.log('res:', results[0].messages);
            }
          });
        })
      )
    ).pipe(map(() => tree));
  };
}
