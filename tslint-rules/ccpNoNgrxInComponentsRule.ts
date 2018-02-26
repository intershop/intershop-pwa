import * as Lint from 'tslint';
import { ImportDeclaration, SourceFile, SyntaxKind } from 'typescript';
import { RuleHelpers } from './ruleHelpers';

const MESSAGE = 'ngrx handling is only allowed in containers.';

class CCPNoNgrxInComponentsWalker extends Lint.RuleWalker {

  constructor(sourceFile: SourceFile, options: Lint.IOptions) {
    super(sourceFile, options);
  }

  public visitSourceFile(sourceFile: SourceFile) {
    if (sourceFile.fileName.match(/.*\/components\/(?!.*(interface|index|spec|module).ts$).*.ts/)) {
      // console.log('####' + sourceFile.fileName);
      super.visitSourceFile(sourceFile);
    }
  }

  public visitImportDeclaration(importStatement: ImportDeclaration) {
    const fromStringToken = RuleHelpers.getNextChildTokenOfKind(importStatement, SyntaxKind.StringLiteral);
    const fromStringText = fromStringToken.getText().substring(1, fromStringToken.getText().length - 1);
    if (fromStringText.search(/\/store(\/|$)/) > 0) {
      this.addFailureAtNode(importStatement, `${MESSAGE} (found ${importStatement.getText()})`);
    }
  }
}

/**
 * Implementation of the ccp-no-ngrx-in-components rule.
 */
export class Rule extends Lint.Rules.AbstractRule {

  public apply(sourceFile: SourceFile): Lint.RuleFailure[] {
    return this.applyWithWalker(new CCPNoNgrxInComponentsWalker(sourceFile, this.getOptions()));
  }
}
