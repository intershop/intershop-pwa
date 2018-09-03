import * as Lint from 'tslint';
import { getNextToken } from 'tsutils';
import * as ts from 'typescript';

class NgrxUseOftypeWithTypeWalker extends Lint.RuleWalker {
  visitIdentifier(node: ts.Identifier) {
    if (node.getText() === 'ofType') {
      const ofTypeOperatorStatement = node.parent;
      if (
        !!ofTypeOperatorStatement &&
        ofTypeOperatorStatement.kind === ts.SyntaxKind.CallExpression &&
        ofTypeOperatorStatement.getChildCount() > 2 &&
        ofTypeOperatorStatement.getChildAt(1).getText() !== '<'
      ) {
        const followedOperator = getNextToken(getNextToken(ofTypeOperatorStatement));

        if (/^(m|switchM|flatM|concatM|exhaustM|mergeM)ap$/.test(followedOperator.getText())) {
          const followedOperatorBody = followedOperator.parent.getChildAt(2).getChildAt(0);
          if (!followedOperatorBody.getText().startsWith('()')) {
            this.addFailureAtNode(
              ofTypeOperatorStatement.getChildAt(0),
              'use ofType operator with specific action type'
            );
          }
        }
      }
    }
  }
}

/**
 * Implementation of the ngrx-use-oftype-with-type rule.
 */
export class Rule extends Lint.Rules.AbstractRule {
  apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    return this.applyWithWalker(new NgrxUseOftypeWithTypeWalker(sourceFile, this.getOptions()));
  }
}
