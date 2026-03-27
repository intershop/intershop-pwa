import { Rule } from '@angular-devkit/schematics';
import { execSync } from 'child_process';
import { once } from 'lodash';
import { join } from 'path';

import { findProjectRoot } from './filesystem';

const lintFiles: string[] = [];

const registerLintAtEnd = once((root: string) => {
  process.on('exit', () => {
    if (process.env.CI !== 'true') {
      if (lintFiles.length) {
        process.stdout.write(`\nLINTING ${lintFiles.length} files...`);
        try {
          const absolutePaths = lintFiles.map(file => join(root, file));

          // Process files in batches to avoid "command line too long" error
          const batchSize = 40; // Adjust this number if needed
          const batches = [];
          for (let i = 0; i < absolutePaths.length; i += batchSize) {
            batches.push(absolutePaths.slice(i, i + batchSize));
          }

          for (const batch of batches) {
            execSync(`npx prettier --write --loglevel warn ${batch.join(' ')}`, { cwd: root });
            execSync(`npx eslint --fix ${batch.join(' ')}`, { cwd: root });
          }
        } catch (error) {
          process.stderr.write('Error details:', error);
        }
      }
    } else {
      console.log('LINTING skipped for CI=true');
    }
  });
});

export function applyLintFix(): Rule {
  return tree => {
    // do nothing for option --dry-run
    if (process.argv.some(arg => arg === '--dry-run')) {
      return;
    }
    // Only include files that have been touched.
    tree.actions
      .filter(action => action.kind !== 'd')
      .map(action => action.path.substring(1))
      .filter(path => path.endsWith('.ts') || path.endsWith('.html'))
      .forEach(file => {
        if (!lintFiles.includes(file)) {
          lintFiles.push(file);
        }
      });

    registerLintAtEnd(findProjectRoot());
  };
}
