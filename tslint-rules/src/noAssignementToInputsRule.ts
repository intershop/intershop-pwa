import { NgWalker } from 'codelyzer/angular/ngWalker';
import * as Lint from 'tslint';
import * as ts from 'typescript';

class NoAssignementToInputsWalker extends NgWalker {
  private inputs: ts.Identifier[] = [];
  private assignements: ts.Node[] = [];

  constructor(sourceFile: ts.SourceFile, options: Lint.IOptions) {
    super(sourceFile, options);
  }

  visitSourceFile(node: ts.SourceFile) {
    super.visitSourceFile(node);
    this.compute();
  }

  visitPropertyDecorator(decorator: ts.Decorator) {
    super.visitPropertyDecorator(decorator);
    if (decorator.expression.getChildAt(0).getText() === 'Input') {
      const identifier = decorator.parent
        .getChildren()
        .find(node => node.kind === ts.SyntaxKind.Identifier) as ts.Identifier;
      this.inputs.push(identifier);
    }
  }

  visitExpressionStatement(node: ts.ExpressionStatement) {
    super.visitExpressionStatement(node);
    const assignement = node.getChildren().find(n => n.kind === ts.SyntaxKind.BinaryExpression);
    if (assignement) {
      this.assignements.push(assignement);
    }
  }

  private compute() {
    this.assignements
      .filter(assignement => {
        const leftSide = assignement.getChildAt(0).getText();
        return this.inputs.find(inp => new RegExp(`^this\.${inp.getText()}$`).test(leftSide));
      })
      .forEach(assignement =>
        this.addFailureAtNode(assignement, 'Assigning to @Input decorated properties is forbidden.')
      );
  }
}

/**
 * Implementation of the no-assignement-to-inputs rule.
 */
export class Rule extends Lint.Rules.AbstractRule {
  apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    return this.applyWithWalker(new NoAssignementToInputsWalker(sourceFile, this.getOptions()));
  }
}
