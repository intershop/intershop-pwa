import { Rule } from '@angular-devkit/schematics';

/**
 * Returns a no-op rule that announces the start of a migration on the console, so users get immediate
 * feedback that the migration is running before any file changes are reported.
 */
export function logMigrationStart(name: string): Rule {
  return tree => {
    process.stdout.write(`\nRunning migration '${name}'...\n`);
    return tree;
  };
}
