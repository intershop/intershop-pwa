import * as Lint from 'tslint';
import * as ts from 'typescript';
import {  SourceFile } from 'typescript';

const FAILURE_STRING = 'Variables for Observables must end with an \'$\' ';

class DollarForObservablesWalker extends Lint.RuleWalker {

  public visitSourceFile(sourceFile: SourceFile) {
    if (sourceFile.fileName.search('.ts') > 0) {
      // console.log('####' + sourceFile.fileName);
      super.visitSourceFile(sourceFile);
    }

  }

  protected visitVariableDeclaration(node: ts.VariableDeclaration): void {
    this.checkVariableDeclaration(node);
    super.visitVariableDeclaration(node);
  }

  protected visitVariableStatement(node: ts.VariableStatement): void {
    node.forEachChild((subNode: ts.VariableDeclaration) => {
      this.checkVariableDeclaration(subNode);
    });
    super.visitVariableStatement(node);
  }

  protected visitPropertyDeclaration(node: ts.PropertyDeclaration): void {
    this.checkDeclaration(node.name.getText(), node.type, node);
  }

  private checkVariableDeclaration(node: ts.VariableDeclaration) {
    const identifier: ts.Identifier = <ts.Identifier>node.name;
    const type: ts.TypeNode = <ts.TypeNode>node.type;
    if (identifier) {
      this.checkDeclaration(identifier.getText(), type, node);
    }
  }

  private checkDeclaration(identifier: string, type: ts.TypeNode, node: ts.Node) {
    if (type && identifier) {
      // console.log('Variable: ' + identifier + ': ' + type.getText() + ' (' + node.getText() + ')');
      if ( (type.getText().search('Observable') >= 0 ||
            type.getText().search('Subject') >= 0) && !identifier.endsWith('$')) {
        this.addFailureAtNode(node, FAILURE_STRING + node.getText());
      }
    }
  }
}

export class Rule extends Lint.Rules.AbstractRule {

  public apply(sourceFile: SourceFile): Lint.RuleFailure[] {
    return this.applyWithWalker(new DollarForObservablesWalker(sourceFile, this.getOptions()));
  }
}
