import * as Lint from 'tslint';
import * as ts from 'typescript';

class UseShorthandPropertyInObjectCreationWalker extends Lint.RuleWalker {
  visitObjectLiteralExpression(node: ts.ObjectLiteralExpression) {
    node
      .getChildAt(1)
      .getChildren()
      .filter(cn => cn.kind === ts.SyntaxKind.PropertyAssignment)
      .map(cn => cn as ts.PropertyAssignment)
      .filter(pa => pa.name.getText() === pa.initializer.getText())
      .forEach(pa =>
        this.addFailureAtNode(
          pa,
          'Use shorthand property assignement.',
          Lint.Replacement.replaceNode(pa, pa.name.getText())
        )
      );
  }
}

/**
 * Implementation of the use-shorthand-property-in-object-creation rule.
 */
export class Rule extends Lint.Rules.AbstractRule {
  apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    return this.applyWithWalker(new UseShorthandPropertyInObjectCreationWalker(sourceFile, this.getOptions()));
  }
}
