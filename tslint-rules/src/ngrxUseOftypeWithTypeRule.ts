import { tsquery } from '@phenomnomnominal/tsquery';
import * as Lint from 'tslint';
import { getNextToken } from 'tsutils';
import * as ts from 'typescript';

export class Rule extends Lint.Rules.AbstractRule {
  apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    return this.applyWithFunction(sourceFile, ctx => {
      tsquery(ctx.sourceFile, 'Identifier[name="ofType"]').forEach(node => {
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
              ctx.addFailureAtNode(
                ofTypeOperatorStatement.getChildAt(0),
                'use ofType operator with specific action type'
              );
            }
          }
        }
      });
    });
  }
}
