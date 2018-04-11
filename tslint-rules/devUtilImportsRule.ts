import * as Lint from 'tslint';
import { ImportDeclaration, SourceFile, SyntaxKind } from 'typescript';
import { RuleHelpers } from './ruleHelpers';

class DevUtilImportsWalker extends Lint.RuleWalker {

  visitSourceFile(sourceFile: SourceFile) {
    if (sourceFile.fileName.search(/.spec.ts/) < 0) {
      super.visitSourceFile(sourceFile);
    }
  }

  visitImportDeclaration(importStatement: ImportDeclaration) {
    const fromStringToken = RuleHelpers.getNextChildTokenOfKind(importStatement, SyntaxKind.StringLiteral);
    const fromStringText = fromStringToken.getText();
    if (fromStringText.indexOf('utils/dev') > 0) {
      this.addFailureAtNode(importStatement, 'Importing utils/dev is only allowed in tests.');
    }
  }
}

/**
 * Implementation of the dev-util-imports rule.
 */
export class Rule extends Lint.Rules.AbstractRule {

  apply(sourceFile: SourceFile): Lint.RuleFailure[] {
    return this.applyWithWalker(new DevUtilImportsWalker(sourceFile, this.getOptions()));
  }
}
