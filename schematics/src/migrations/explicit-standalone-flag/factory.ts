import { Rule, chain, externalSchematic } from '@angular-devkit/schematics';
import { dirname, join } from 'path';

import { applyLintFix } from '../../utils/lint-fix';
import { logMigrationStart } from '../../utils/log-migration';

/**
 * Delegates to Angular's official `explicit-standalone-flag` migration.
 *
 * The PWA delivers Angular upgrades as committed source (via git cherry-pick/rebase/merge) rather than via
 * `ng update @angular/core`, so Angular's own migration never runs against a project's custom code. This
 * migration re-triggers it so that in-program (NgModule-declared) custom artifacts receive an explicit
 * `standalone` flag. Theme override files, which are not part of the default TypeScript program, are handled
 * separately by the `standalone-override-flag` migration.
 *
 * Angular ships `explicit-standalone-flag` in its `ng-update` migrations collection (not the public
 * `collection.json`), so it is referenced by the absolute path of that collection resolved at runtime.
 * `applyLintFix` reformats the touched files so the output matches the project's prettier/eslint style.
 */
export function migrateExplicitStandaloneFlag(): Rule {
  const migrationsPath = join(dirname(require.resolve('@angular/core/package.json')), 'schematics', 'migrations.json');
  return chain([
    logMigrationStart('explicit-standalone-flag'),
    externalSchematic(migrationsPath, 'explicit-standalone-flag', {}),
    applyLintFix(),
  ]);
}
