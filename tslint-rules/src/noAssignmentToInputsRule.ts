import { NgWalker } from 'codelyzer/angular/ngWalker';
import * as Lint from 'tslint';
import * as ts from 'typescript';

class NoAssignmentToInputsWalker extends NgWalker {
  private inputs: ts.Identifier[] = [];
  private assignments: ts.Node[] = [];

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
    const assignment = node.getChildren().find(n => n.kind === ts.SyntaxKind.BinaryExpression);
    if (assignment) {
      this.assignments.push(assignment);
    }
  }

  private compute() {
    this.assignments
      .filter(assignment => {
        const leftSide = assignment.getChildAt(0).getText();
        return this.inputs.find(inp => new RegExp(`^this\.${inp.getText()}$`).test(leftSide));
      })
      .forEach(assignment =>
        this.addFailureAtNode(assignment, 'Assigning to @Input decorated properties is forbidden.')
      );
  }
}

/**
 * Implementation of the no-assignment-to-inputs rule.
 */
export class Rule extends Lint.Rules.AbstractRule {
  apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    return this.applyWithWalker(new NoAssignmentToInputsWalker(sourceFile, this.getOptions()));
  }
}
