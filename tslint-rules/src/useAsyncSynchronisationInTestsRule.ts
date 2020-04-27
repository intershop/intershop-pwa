import { tsquery } from '@phenomnomnominal/tsquery';
import * as Lint from 'tslint';
import * as ts from 'typescript';

export class Rule extends Lint.Rules.AbstractRule {
  apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    if (!sourceFile.fileName.endsWith('.spec.ts')) {
      return [];
    }

    return this.applyWithFunction(sourceFile, ctx => {
      tsquery(ctx.sourceFile, 'ArrowFunction').forEach(block => {
        if (
          block.parent
            .getChildAt(0)
            .getText()
            .endsWith('.subscribe') &&
          block.getText().search(/\sdone\(\)/) < 0
        ) {
          ctx.addFailureAtNode(
            block,
            'asynchronous operations in tests should call done callback, see https://facebook.github.io/jest/docs/en/asynchronous.html'
          );
        }
      });
    });
  }
}
