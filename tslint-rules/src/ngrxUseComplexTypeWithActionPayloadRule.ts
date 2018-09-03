import * as Lint from 'tslint';
import * as ts from 'typescript';

class NgrxUseComplexTypeWithActionPayloadWalker extends Lint.RuleWalker {
  visitCallExpression(node: ts.CallExpression) {
    super.visitCallExpression(node);
    if (node.getChildAt(0).getText() === 'action') {
      if (node.getChildAt(2).getChildCount() > 3) {
        this.addFailureAtNode(node, 'Actions should have only one payload parameter.');
      }
      const payload = node.getChildAt(2).getChildAt(2);
      if (payload) {
        if (payload.getChildAt(0).getText() !== 'payload') {
          this.addFailureAtNode(node, 'Actions should have only one payload parameter.');
        } else if (
          !payload
            .getChildAt(2)
            .getText()
            .startsWith('{')
        ) {
          this.addFailureAtNode(payload, 'The payload of actions should be a complex type with named content.');
        }
      }
    }
  }

  visitConstructorDeclaration(node: ts.ConstructorDeclaration) {
    super.visitConstructorDeclaration(node);
    const isActionClass = node.parent
      .getChildren()
      .map(c => c.getText() === 'implements Action')
      .reduce((a, b) => a || b);
    if (isActionClass) {
      const constructorParameterList = node.getChildAt(2);
      if (constructorParameterList.getChildCount() > 1) {
        this.addFailureAtNode(
          constructorParameterList,
          'Actions should have only one payload parameter called "payload".'
        );
      } else {
        const firstConstructorParameter = constructorParameterList.getChildAt(0);
        if (firstConstructorParameter.getChildAt(1).getText() !== 'payload') {
          this.addFailureAtNode(
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
            this.addFailureAtNode(
              typeOfFirstConstructorParameter,
              'The payload of actions should be a complex type with named content.'
            );
          }
        }
      }
    }
  }
}

/**
 * Implementation of the ngrx-use-complex-type-with-action-payload rule.
 */
export class Rule extends Lint.Rules.AbstractRule {
  apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    return this.applyWithWalker(new NgrxUseComplexTypeWithActionPayloadWalker(sourceFile, this.getOptions()));
  }
}
