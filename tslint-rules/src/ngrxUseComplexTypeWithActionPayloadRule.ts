import { tsquery } from '@phenomnomnominal/tsquery';
import * as Lint from 'tslint';
import * as ts from 'typescript';

export class Rule extends Lint.Rules.AbstractRule {
  apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    if (!sourceFile.fileName.endsWith('actions.ts')) {
      return [];
    }

    return this.applyWithFunction(sourceFile, ctx => {
      tsquery(ctx.sourceFile, 'CallExpression').forEach((node: ts.CallExpression) => {
        if (node.getChildAt(0).getText() === 'action') {
          if (node.getChildAt(2).getChildCount() > 3) {
            ctx.addFailureAtNode(node, 'Actions should have only one payload parameter.');
          }
          const payload = node.getChildAt(2).getChildAt(2);
          if (payload) {
            if (payload.getChildAt(0).getText() !== 'payload') {
              ctx.addFailureAtNode(node, 'Actions should have only one payload parameter.');
            } else if (
              !payload
                .getChildAt(2)
                .getText()
                .startsWith('{')
            ) {
              ctx.addFailureAtNode(payload, 'The payload of actions should be a complex type with named content.');
            }
          }
        }
      });

      tsquery(ctx.sourceFile, '*')
        .filter(ts.isConstructorDeclaration)
        .forEach((node: ts.ConstructorDeclaration) => {
          const isActionClass = node.parent
            .getChildren()
            .map(c => c.getText() === 'implements Action')
            .reduce((a, b) => a || b);
          if (isActionClass) {
            const constructorParameterList = node.getChildAt(2);
            if (constructorParameterList.getChildCount() > 1) {
              ctx.addFailureAtNode(
                constructorParameterList,
                'Actions should have only one payload parameter called "payload".'
              );
            } else {
              const firstConstructorParameter = constructorParameterList.getChildAt(0);
              if (firstConstructorParameter.getChildAt(1).getText() !== 'payload') {
                ctx.addFailureAtNode(
                  firstConstructorParameter.getChildAt(1),
                  'Actions should have only one payload parameter called "payload".'
                );
              } else {
                const typeOfFirstConstructorParameter = firstConstructorParameter.getChildAt(
                  firstConstructorParameter.getChildCount() - 1
                );
                if (
                  !typeOfFirstConstructorParameter.getText().startsWith('{') &&
                  !typeOfFirstConstructorParameter.getText().endsWith('Type')
                ) {
                  ctx.addFailureAtNode(
                    typeOfFirstConstructorParameter,
                    'The payload of actions should be a complex type with named content.'
                  );
                }
              }
            }
          }
        });
    });
  }
}
