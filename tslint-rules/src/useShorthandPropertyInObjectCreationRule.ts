import { tsquery } from '@phenomnomnominal/tsquery';
import * as Lint from 'tslint';
import * as ts from 'typescript';

export class Rule extends Lint.Rules.AbstractRule {
  apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    return this.applyWithFunction(sourceFile, ctx => {
      tsquery(sourceFile, 'ObjectLiteralExpression PropertyAssignment')
        .filter((pa: ts.PropertyAssignment) => pa.name.getText() === pa.initializer.getText())
        .forEach((pa: ts.PropertyAssignment) =>
          ctx.addFailureAtNode(
            pa,
            'Use shorthand property assignement.',
            Lint.Replacement.replaceNode(pa, pa.name.getText())
          )
        );
    });
  }
}
