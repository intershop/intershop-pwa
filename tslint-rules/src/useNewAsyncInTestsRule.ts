import { tsquery } from '@phenomnomnominal/tsquery';
import * as Lint from 'tslint';
import * as ts from 'typescript';

export class Rule extends Lint.Rules.AbstractRule {
  apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    if (!sourceFile.fileName.endsWith('.spec.ts')) {
      return [];
    }

    return this.applyWithFunction(sourceFile, ctx => {
      tsquery(ctx.sourceFile, 'CallExpression[expression.text=beforeEach] > CallExpression[expression.text=async]')
        .filter(
          (asyncCall: ts.CallExpression) =>
            asyncCall.arguments?.length === 1 &&
            !!tsquery(
              asyncCall.arguments[0],
              "CallExpression:has(PropertyAccessExpression[text='TestBed.configureTestingModule'])[expression.name.text='compileComponents']"
            ).length
        )
        .forEach((asyncCall: ts.CallExpression) => {
          ctx.addFailureAtNode(
            asyncCall,
            'Use native async/await or migrate to waitForAsync.',
            Lint.Replacement.replaceNode(
              asyncCall,
              'async ' +
                asyncCall.arguments[0]
                  .getText()
                  .replace('TestBed.configureTestingModule', 'await TestBed.configureTestingModule')
            )
          );
        });
    });
  }
}
