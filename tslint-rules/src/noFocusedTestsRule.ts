import { tsquery } from '@phenomnomnominal/tsquery';
import * as Lint from 'tslint';
import * as ts from 'typescript';

export class Rule extends Lint.Rules.AbstractRule {
  apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    if (!sourceFile.fileName.endsWith('spec.ts')) {
      return [];
    }
    return this.applyWithFunction(sourceFile, ctx => {
      tsquery(ctx.sourceFile, 'Identifier[name=/^f(it|describe)$/]').forEach(node =>
        ctx.addFailureAtNode(node, 'Focused test.')
      );
      tsquery(ctx.sourceFile, 'PropertyAccessExpression[text=/(it|describe).only$/]').forEach(node => {
        ctx.addFailureAtNode(node, 'Focused test.');
      });
    });
  }
}
