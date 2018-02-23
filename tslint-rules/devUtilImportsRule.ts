import * as Lint from 'tslint';
import { ImportDeclaration, SourceFile, SyntaxKind } from 'typescript';
import { RuleHelpers } from './ruleHelpers';

class DevUtilImportsWalker extends Lint.RuleWalker {

  public visitSourceFile(sourceFile: SourceFile) {
    if (sourceFile.fileName.search(/.spec.ts/) < 0) {
      // console.log('####' + sourceFile.fileName);
      super.visitSourceFile(sourceFile);
    }
  }

  public visitImportDeclaration(importStatement: ImportDeclaration) {
    const fromStringToken = RuleHelpers.getNextChildTokenOfKind(importStatement, SyntaxKind.StringLiteral);
    const fromStringText = fromStringToken.getText();
    if (fromStringText.indexOf('dev-utils') > 0) {
      this.addFailureAtNode(importStatement, 'Importing dev-utils is only allowed in tests.');
    }
  }
}

/**
 * Implementation of the dev-util-imports rule.
 */
export class Rule extends Lint.Rules.AbstractRule {

  public apply(sourceFile: SourceFile): Lint.RuleFailure[] {
    return this.applyWithWalker(new DevUtilImportsWalker(sourceFile, this.getOptions()));
  }
}
