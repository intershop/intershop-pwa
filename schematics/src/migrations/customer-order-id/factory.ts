import { Rule, chain } from '@angular-devkit/schematics';
import { getWorkspace } from '@schematics/angular/utility/workspace';
import { Identifier, Node, SourceFile, SyntaxKind } from 'ts-morph';

import { applyLintFix } from '../../utils/lint-fix';
import { logMigrationStart } from '../../utils/log-migration';
import { createTsMorphProject } from '../../utils/ts-morph';

const RENAMES: Record<string, string> = {
  externalOrderReference: 'customerOrderID',
  updateBasketExternalOrderReference: 'updateBasketCustomerOrderID',
};

const OLD_NAMES_PATTERN = new RegExp(`\\b(${Object.keys(RENAMES).join('|')})\\b`, 'g');

/**
 * API interfaces and mappers handle the raw ICM data, which still contains the deprecated `externalOrderReference`.
 */
const API_DATA_FILE_PATTERN = /\.(interface|mapper)(\.spec)?\.ts$/;

/**
 * Checks whether the identifier names a property or method (declaration, access, object literal key, destructured
 * property) rather than a local variable or parameter.
 */
function isMemberName(identifier: Identifier, parent: Node): boolean {
  if (Node.isPropertyAccessExpression(parent)) {
    return parent.getNameNode() === identifier;
  }
  if (Node.isBindingElement(parent)) {
    return parent.getPropertyNameNode() === identifier;
  }
  return (
    (Node.isPropertyAssignment(parent) ||
      Node.isPropertyDeclaration(parent) ||
      Node.isPropertySignature(parent) ||
      Node.isMethodDeclaration(parent) ||
      Node.isMethodSignature(parent) ||
      Node.isGetAccessorDeclaration(parent) ||
      Node.isSetAccessorDeclaration(parent)) &&
    parent.getNameNode() === identifier
  );
}

/**
 * Renames an old name wherever it names a property or method. Local variables and parameters keep their names;
 * shorthand properties and destructured bindings are expanded to `newName: oldName` so they stay valid.
 */
function migrateIdentifier(identifier: Identifier): void {
  const newName = RENAMES[identifier.getText()];
  const parent = identifier.getParent();

  if (
    Node.isShorthandPropertyAssignment(parent) ||
    (Node.isBindingElement(parent) && !parent.getPropertyNameNode() && Node.isObjectBindingPattern(parent.getParent()))
  ) {
    parent.replaceWithText(`${newName}: ${parent.getText()}`);
  } else if (isMemberName(identifier, parent)) {
    identifier.replaceWithText(newName);
  }
}

function migrateSourceFile(sourceFile: SourceFile): void {
  sourceFile
    .getDescendantsOfKind(SyntaxKind.Identifier)
    .filter(identifier => Object.hasOwn(RENAMES, identifier.getText()))
    .reverse()
    .forEach(identifier => {
      if (!identifier.wasForgotten()) {
        migrateIdentifier(identifier);
      }
    });
}

/**
 * Migrates custom code from the basket/order model property `externalOrderReference` and the
 * `CheckoutFacade.updateBasketExternalOrderReference()` method to `customerOrderID` and
 * `updateBasketCustomerOrderID()`, following the ICM API rename.
 *
 * TypeScript files are migrated syntax-based, templates by name. API interfaces and mappers are skipped, because
 * they still need the deprecated API field. String-based references (e.g. `Pick<Basket, 'externalOrderReference'>`)
 * are not migrated and need a manual review.
 */
export function migrateCustomerOrderId(): Rule {
  return chain([
    logMigrationStart('customer-order-id'),
    async host => {
      const workspace = await getWorkspace(host);
      const tsProject = createTsMorphProject(host);

      const sourceRoots = new Set(
        [...workspace.projects.values()].map(project => project.sourceRoot ?? project.root).filter(Boolean)
      );

      for (const sourceRoot of sourceRoots) {
        host.getDir(`/${sourceRoot}`).visit(filePath => {
          const isTemplate = filePath.endsWith('.html');
          const isScript = filePath.endsWith('.ts') && !filePath.endsWith('.d.ts');
          if ((!isTemplate && !isScript) || API_DATA_FILE_PATTERN.test(filePath)) {
            return;
          }

          const content = host.read(filePath)?.toString();
          if (!content || !Object.keys(RENAMES).some(oldName => content.includes(oldName))) {
            return;
          }

          if (isTemplate) {
            const migrated = content.replace(OLD_NAMES_PATTERN, oldName => RENAMES[oldName]);
            if (migrated !== content) {
              host.overwrite(filePath, migrated);
            }
            return;
          }

          const sourceFile = tsProject.getSourceFile(filePath) ?? tsProject.addSourceFileAtPath(filePath);
          const originalText = sourceFile.getFullText();

          migrateSourceFile(sourceFile);

          if (sourceFile.getFullText() !== originalText) {
            host.overwrite(filePath, sourceFile.getFullText());
          }
        });
      }
    },
    applyLintFix(),
  ]);
}
