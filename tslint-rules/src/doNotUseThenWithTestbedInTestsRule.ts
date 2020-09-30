import { tsquery } from '@phenomnomnominal/tsquery';
import * as Lint from 'tslint';
import * as ts from 'typescript';

export class Rule extends Lint.Rules.AbstractRule {
  apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    if (!sourceFile.fileName.endsWith('.spec.ts')) {
      return [];
    }

    return this.applyWithFunction(sourceFile, ctx => {
      tsquery(
        ctx.sourceFile,
        "CallExpression[expression.name.text='then']:has(PropertyAccessExpression[text='TestBed.configureTestingModule'])"
      ).forEach((thenCall: ts.CallExpression) => {
        ctx.addFailureAtNode(
          (thenCall.expression as ts.PropertyAccessExpression).name,
          'Chaining off TestBed.configureTestingModule can be replaced by adding another beforeEach without async.'
        );
      });
    });
  }
}
