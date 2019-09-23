import { tsquery } from '@phenomnomnominal/tsquery';
import * as Lint from 'tslint';
import * as ts from 'typescript';

const MESSAGE = 'Observable stream should be initialized in ngOnInit';

export class Rule extends Lint.Rules.AbstractRule {
  apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    if (!tsquery(sourceFile, 'Decorator > CallExpression > Identifier[name="Component"]').length) {
      return;
    }

    return this.applyWithFunction(sourceFile, ctx => {
      tsquery(ctx.sourceFile, 'PropertyDeclaration')
        .filter(
          (x: ts.PropertyDeclaration) =>
            x.name.getText().endsWith('$') &&
            !!x.initializer &&
            !tsquery(x.initializer, 'NewExpression > Identifier[name=/.*Subject/]').length
        )
        .forEach((x: ts.PropertyDeclaration) => {
          ctx.addFailureAtNode(x.name, MESSAGE);
        });

      tsquery(
        ctx.sourceFile,
        'Constructor ExpressionStatement PropertyAccessExpression > Identifier[name=/.*\\$$/]'
      ).forEach(x => ctx.addFailureAtNode(x, MESSAGE));
    });
  }
}
