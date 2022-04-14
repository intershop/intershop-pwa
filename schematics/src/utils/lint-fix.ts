import { Rule } from '@angular-devkit/schematics';
import { execSync } from 'child_process';
import { once } from 'lodash';

import { findProjectRoot } from './filesystem';

const lintFiles: string[] = [];

const registerLintAtEnd = once((root: string) => {
  process.on('exit', () => {
    if (process.env.CI !== 'true') {
      if (lintFiles.length) {
        console.log('LINTING', lintFiles.length, lintFiles.length === 1 ? 'file' : 'files');

        execSync(`npx prettier --write --loglevel warn ${lintFiles.join(' ')}`, { cwd: root });
        execSync(`npx eslint --fix ${lintFiles.join(' ')}`, { cwd: root });
      }
    } else {
      console.log('LINTING skipped for CI=true');
    }
  });
});

export function applyLintFix(): Rule {
  return tree => {
    // Only include files that have been touched.
    tree.actions
      .map(action => action.path.substring(1))
      .filter(path => path.endsWith('.ts') || path.endsWith('.html'))
      .forEach(file => {
        if (!lintFiles.includes(file)) lintFiles.push(file);
      });

    registerLintAtEnd(findProjectRoot());
  };
}
