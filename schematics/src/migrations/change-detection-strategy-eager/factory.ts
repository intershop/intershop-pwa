import { Rule, chain } from '@angular-devkit/schematics';
import { getWorkspace } from '@schematics/angular/utility/workspace';
import { SourceFile, SyntaxKind } from 'ts-morph';

import { applyLintFix } from '../../utils/lint-fix';
import { logMigrationStart } from '../../utils/log-migration';
import { createTsMorphProject } from '../../utils/ts-morph';

/**
 * Replaces `ChangeDetectionStrategy.Default` with `ChangeDetectionStrategy.Eager` (same value), respecting an
 * import alias. Only files importing `ChangeDetectionStrategy` from `@angular/core` are processed.
 */
function migrateChangeDetectionStrategy(sourceFile: SourceFile): void {
  const specifier = sourceFile
    .getImportDeclaration(decl => decl.getModuleSpecifierValue() === '@angular/core')
    ?.getNamedImports()
    .find(named => named.getName() === 'ChangeDetectionStrategy');
  if (!specifier) {
    return;
  }
  const localName = specifier.getAliasNode()?.getText() ?? specifier.getName();

  sourceFile
    .getDescendantsOfKind(SyntaxKind.PropertyAccessExpression)
    .filter(access => access.getName() === 'Default' && access.getExpression().getText() === localName)
    .reverse()
    .forEach(access => access.getNameNode().replaceWithText('Eager'));
}

/**
 * Migrates custom code from the `ChangeDetectionStrategy.Default` deprecated with Angular 21 to
 * `ChangeDetectionStrategy.Eager`, which Angular does not provide a migration for.
 */
export function migrateChangeDetectionStrategyEager(): Rule {
  return chain([
    logMigrationStart('change-detection-strategy-eager'),
    async host => {
      const workspace = await getWorkspace(host);
      const tsProject = createTsMorphProject(host);

      const sourceRoots = new Set(
        [...workspace.projects.values()].map(project => project.sourceRoot ?? project.root).filter(Boolean)
      );

      for (const sourceRoot of sourceRoots) {
        host.getDir(`/${sourceRoot}`).visit(filePath => {
          if (
            !filePath.endsWith('.ts') ||
            filePath.endsWith('.d.ts') ||
            !host.read(filePath)?.toString().includes('.Default')
          ) {
            return;
          }

          const sourceFile = tsProject.getSourceFile(filePath) ?? tsProject.addSourceFileAtPath(filePath);
          const originalText = sourceFile.getFullText();

          migrateChangeDetectionStrategy(sourceFile);

          if (sourceFile.getFullText() !== originalText) {
            host.overwrite(filePath, sourceFile.getFullText());
          }
        });
      }
    },
    applyLintFix(),
  ]);
}
