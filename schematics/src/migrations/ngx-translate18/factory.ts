import { Rule, chain } from '@angular-devkit/schematics';
import { getWorkspace } from '@schematics/angular/utility/workspace';
import {
  ArrayLiteralExpression,
  CallExpression,
  Identifier,
  ImportDeclaration,
  Node,
  ObjectLiteralExpression,
  PropertyAccessExpression,
  SourceFile,
  SyntaxKind,
} from 'ts-morph';

import { applyLintFix } from '../../utils/lint-fix';
import { logMigrationStart } from '../../utils/log-migration';
import { createTsMorphProject } from '../../utils/ts-morph';

const NGX_TRANSLATE_MODULE = '@ngx-translate/core';

/**
 * Returns the `@ngx-translate/core` import declaration of the file, if any.
 */
function getNgxTranslateImport(sourceFile: SourceFile): ImportDeclaration | undefined {
  return sourceFile.getImportDeclaration(decl => decl.getModuleSpecifierValue() === NGX_TRANSLATE_MODULE);
}

/**
 * Renames the `TranslateService` API that changed in ngx-translate v17:
 * - `setDefaultLang(...)` -> `setFallbackLang(...)`
 * - `currentLang` (property) -> `getCurrentLang()` (method)
 *
 * Only files that import from `@ngx-translate/core` are processed to limit false positives. Nodes are
 * edited from the bottom up so earlier positions stay valid while the file is mutated.
 */
function migrateServiceApi(sourceFile: SourceFile): void {
  if (!getNgxTranslateImport(sourceFile)) {
    return;
  }

  const propertyAccesses = sourceFile
    .getDescendantsOfKind(SyntaxKind.PropertyAccessExpression)
    .filter(access => access.getName() === 'setDefaultLang' || access.getName() === 'currentLang')
    .reverse();

  for (const access of propertyAccesses) {
    if (access.wasForgotten()) {
      continue;
    }

    if (access.getName() === 'setDefaultLang') {
      access.getNameNode().replaceWithText('setFallbackLang');
      continue;
    }

    const parent = access.getParent();
    const isAssignmentTarget =
      Node.isBinaryExpression(parent) &&
      parent.getOperatorToken().getKind() === SyntaxKind.EqualsToken &&
      parent.getLeft() === access;
    if (!isAssignmentTarget) {
      access.replaceWithText(`${access.getExpression().getText()}.getCurrentLang()`);
    }
  }
}

/**
 * Returns the first `TranslateModule.forRoot(...)` / `TranslateModule.forChild(...)` call in the file, if any.
 */
function findTranslateModuleFactoryCall(sourceFile: SourceFile): CallExpression | undefined {
  return sourceFile.getDescendantsOfKind(SyntaxKind.CallExpression).find(call => {
    const expression = call.getExpression();
    if (!Node.isPropertyAccessExpression(expression)) {
      return false;
    }
    const target = expression.getExpression();
    return (
      Node.isIdentifier(target) &&
      target.getText() === 'TranslateModule' &&
      ['forRoot', 'forChild'].includes(expression.getName())
    );
  });
}

/**
 * Returns the first bare `TranslateModule` reference (e.g. in an `imports`/`exports` array), excluding the
 * import declaration itself and `TranslateModule.xxx` member accesses (which are handled separately).
 */
function findBareTranslateModuleUsage(sourceFile: SourceFile): Identifier | undefined {
  return sourceFile.getDescendantsOfKind(SyntaxKind.Identifier).find(identifier => {
    if (identifier.getText() !== 'TranslateModule' || identifier.getFirstAncestorByKind(SyntaxKind.ImportDeclaration)) {
      return false;
    }
    const parent = identifier.getParent();
    return !(Node.isPropertyAccessExpression(parent) && parent.getExpression() === identifier);
  });
}

/**
 * Returns the `NgModule`/`TestBed` config object literal that owns the `imports` array containing `call`.
 */
function getEnclosingConfigObject(call: CallExpression): ObjectLiteralExpression | undefined {
  const array = call.getParentIfKind(SyntaxKind.ArrayLiteralExpression);
  const property = array?.getParentIfKind(SyntaxKind.PropertyAssignment);
  if (property?.getName() !== 'imports') {
    return;
  }
  return property.getParentIfKind(SyntaxKind.ObjectLiteralExpression);
}

/**
 * Returns the `providers` array of the config object, creating an empty one when it is missing.
 */
function getOrCreateProvidersArray(configObject: ObjectLiteralExpression): ArrayLiteralExpression {
  const existing = configObject.getProperty('providers');
  if (existing && Node.isPropertyAssignment(existing)) {
    const initializer = existing.getInitializer();
    if (initializer && Node.isArrayLiteralExpression(initializer)) {
      return initializer;
    }
  }
  return configObject
    .addPropertyAssignment({ name: 'providers', initializer: '[]' })
    .getInitializerIfKindOrThrow(SyntaxKind.ArrayLiteralExpression);
}

/**
 * Replaces the `TranslateModule` usage removed in ngx-translate v18 with the standalone `TranslatePipe` and,
 * for the previous `forRoot()` configuration, the `provideTranslateService()` provider function:
 * - `TranslateModule.forRoot(config)` in an `imports` array -> `TranslatePipe` in `imports` plus
 *   `provideTranslateService(config)` in `providers`
 * - `TranslateModule.forChild(...)` -> `TranslatePipe`
 * - bare `TranslateModule` (in `imports`/`exports`) -> `TranslatePipe`
 */
function migrateTranslateModule(sourceFile: SourceFile): void {
  const importDeclaration = getNgxTranslateImport(sourceFile);
  if (!importDeclaration?.getNamedImports().some(named => named.getName() === 'TranslateModule')) {
    return;
  }

  let needsTranslatePipe = false;
  let needsProvideTranslateService = false;

  let factoryCall = findTranslateModuleFactoryCall(sourceFile);
  while (factoryCall) {
    const method = (factoryCall.getExpression() as PropertyAccessExpression).getName();
    const argumentsText = factoryCall
      .getArguments()
      .map(argument => argument.getText())
      .join(', ');

    if (method === 'forRoot') {
      const configObject = getEnclosingConfigObject(factoryCall);
      if (configObject) {
        getOrCreateProvidersArray(configObject).addElement(`provideTranslateService(${argumentsText})`);
        factoryCall.replaceWithText('TranslatePipe');
        needsTranslatePipe = true;
      } else {
        factoryCall.replaceWithText(`provideTranslateService(${argumentsText})`);
      }
      needsProvideTranslateService = true;
    } else {
      factoryCall.replaceWithText('TranslatePipe');
      needsTranslatePipe = true;
    }

    factoryCall = findTranslateModuleFactoryCall(sourceFile);
  }

  let bareUsage = findBareTranslateModuleUsage(sourceFile);
  while (bareUsage) {
    bareUsage.replaceWithText('TranslatePipe');
    needsTranslatePipe = true;
    bareUsage = findBareTranslateModuleUsage(sourceFile);
  }

  importDeclaration
    .getNamedImports()
    .find(named => named.getName() === 'TranslateModule')
    ?.remove();

  const presentImports = new Set(importDeclaration.getNamedImports().map(named => named.getName()));
  if (needsTranslatePipe && !presentImports.has('TranslatePipe')) {
    importDeclaration.addNamedImport('TranslatePipe');
  }
  if (needsProvideTranslateService && !presentImports.has('provideTranslateService')) {
    importDeclaration.addNamedImport('provideTranslateService');
  }
  if (
    !importDeclaration.getNamedImports().length &&
    !importDeclaration.getDefaultImport() &&
    !importDeclaration.getNamespaceImport()
  ) {
    importDeclaration.remove();
  }
}

/**
 * Migrates custom code to the ngx-translate breaking changes shipped with Intershop PWA 12 (v16 -> v18):
 * the `TranslateService` API renames (`setDefaultLang`, `currentLang`) and the removal of `TranslateModule`
 * in favor of the standalone `TranslatePipe` and the `provideTranslateService()` provider function.
 *
 * The PWA delivers this upgrade as committed source, so its own artifacts are already migrated - this
 * migration closes the gap for custom components, directives, pipes and their tests. `applyLintFix` reformats
 * the touched files so the output matches the project's prettier/eslint style. Because the changes are
 * mechanical and best-effort, run the project's checks afterwards to catch anything that needs manual review.
 */
export function migrateNgxTranslate(): Rule {
  return chain([
    logMigrationStart('ngx-translate18'),
    async host => {
      const workspace = await getWorkspace(host);
      const tsProject = createTsMorphProject(host);

      const sourceRoots = new Set(
        [...workspace.projects.values()].map(project => project.sourceRoot ?? project.root).filter(Boolean)
      );

      for (const sourceRoot of sourceRoots) {
        host.getDir(`/${sourceRoot}`).visit(filePath => {
          if (!filePath.endsWith('.ts') || filePath.endsWith('.d.ts')) {
            return;
          }

          const sourceFile = tsProject.getSourceFile(filePath) ?? tsProject.addSourceFileAtPath(filePath);
          const originalText = sourceFile.getFullText();

          migrateServiceApi(sourceFile);
          migrateTranslateModule(sourceFile);

          if (sourceFile.getFullText() !== originalText) {
            host.overwrite(filePath, sourceFile.getFullText());
          }
        });
      }
    },
    applyLintFix(),
  ]);
}
