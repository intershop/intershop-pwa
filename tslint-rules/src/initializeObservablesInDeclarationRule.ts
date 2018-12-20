import { NgWalker } from 'codelyzer/angular/ngWalker';
import * as Lint from 'tslint';
import * as ts from 'typescript';

class InitializeObservablesInDeclarationWalker extends NgWalker {
  private onlySimple: boolean;
  private inputs: ts.Identifier[] = [];
  private observables: ts.Identifier[] = [];
  private assignements: ts.Node[] = [];
  private declAssignements: ts.Node[] = [];

  constructor(sourceFile: ts.SourceFile, options: Lint.IOptions) {
    super(sourceFile, options);

    if (options.ruleArguments && options.ruleArguments[0] && options.ruleArguments[0]['only-simple']) {
      this.onlySimple = options.ruleArguments[0]['only-simple'];
    }
  }

  visitSourceFile(node: ts.SourceFile) {
    super.visitSourceFile(node);
    this.compute();
  }

  visitPropertyDeclaration(prop: ts.PropertyDeclaration) {
    super.visitPropertyDeclaration(prop);

    const identifier = prop.getChildren().find(n => n.kind === ts.SyntaxKind.Identifier) as ts.Identifier;

    if (
      prop
        .getChildAt(0)
        .getText()
        .startsWith('@Input')
    ) {
      this.inputs.push(identifier);
    } else if (
      prop.getChildren().find(n => n.kind === ts.SyntaxKind.TypeReference && n.getText().startsWith('Observable<'))
    ) {
      this.observables.push(identifier);
    } else {
      const declAssignement = prop.getChildren().find(n => n.kind === ts.SyntaxKind.CallExpression);
      if (declAssignement) {
        this.declAssignements.push(declAssignement);
      }
    }
  }

  visitExpressionStatement(node: ts.ExpressionStatement) {
    super.visitExpressionStatement(node);
    const assignement = node.getChildren().find(n => n.kind === ts.SyntaxKind.BinaryExpression);
    if (assignement && assignement.getChildAt(0).kind === ts.SyntaxKind.PropertyAccessExpression) {
      this.assignements.push(assignement);
    }
  }

  private compute() {
    this.assignements
      .filter(assignment => {
        // filter only observable assignements
        const leftSide = assignment.getChildAt(0).getText();
        return this.observables.find(obs => leftSide.endsWith(obs.getText()));
      })
      .filter(assignement => {
        // filter for assignements that don't depend on input parameters
        const rightSide = assignement.getChildAt(2).getText();
        return !this.inputs.find(inp => new RegExp(`this\.${inp.getText()}[^\w]`).test(rightSide));
      })
      .filter(assignement => {
        // filter for assignements that have been made in constructor or ngOnInit
        let node = assignement;
        while (node) {
          if (node.kind === ts.SyntaxKind.Constructor) {
            return true;
          } else if (node.kind === ts.SyntaxKind.MethodDeclaration && node.getText().startsWith('ngOnInit')) {
            return true;
          }
          node = node.parent;
        }
        return false;
      })
      .filter(assignement => {
        // check if assignment is simple
        const rightSide = assignement.getChildAt(2).getText();
        return !this.onlySimple || rightSide.search(',') < 0;
      })
      .forEach(assignment => {
        const name = assignment
          .getChildAt(0)
          .getText()
          .substring(5);
        this.addFailureAtNode(
          assignment,
          `${this.onlySimple ? 'Simple' : ''} Observable initialization of '${name}' can be made in declaration.`
        );
      });

    this.declAssignements
      .filter(assignement =>
        this.inputs.find(inp => new RegExp(`this\.${inp.getText()}[^\w]`).test(assignement.getText()))
      )
      .forEach(assignement =>
        this.addFailureAtNode(
          assignement,
          'Initialization depends on Input decorated property and can therefor not be made in declaration. Use ngOnInit instead.'
        )
      );
  }
}

/**
 * Implementation of the initialize-observables-in-declaration rule.
 */
export class Rule extends Lint.Rules.AbstractRule {
  apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    return this.applyWithWalker(new InitializeObservablesInDeclarationWalker(sourceFile, this.getOptions()));
  }
}
