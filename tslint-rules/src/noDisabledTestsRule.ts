import { tsquery } from '@phenomnomnominal/tsquery';
import * as Lint from 'tslint';
import * as ts from 'typescript';

export class Rule extends Lint.Rules.AbstractRule {
  apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    if (!sourceFile.fileName.endsWith('spec.ts')) {
      return [];
    }
    return this.applyWithFunction(sourceFile, ctx => {
      tsquery(ctx.sourceFile, 'Identifier[name=/^x(it|describe)$/]').forEach(node =>
        ctx.addFailureAtNode(node, 'Disabled test.')
      );
      tsquery(ctx.sourceFile, 'PropertyAccessExpression[text=/(it|describe).skip$/]').forEach(node => {
        ctx.addFailureAtNode(node, 'Disabled test.');
      });
    });
  }
}
