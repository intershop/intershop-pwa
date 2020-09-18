import { NgWalker } from 'codelyzer/angular/ngWalker';
import * as Lint from 'tslint';
import * as ts from 'typescript';

class PrivateDestroyFieldWalker extends NgWalker {
  private apply = false;

  visitClassDecorator(decorator: ts.Decorator) {
    const type = decorator.getChildAt(1).getChildAt(0).getText();

    this.apply = type === 'Component' || type === 'Directive' || type === 'Pipe';
  }

  visitPropertyDeclaration(prop: ts.PropertyDeclaration) {
    if (this.apply) {
      const name = prop
        .getChildren()
        .filter(node => node.kind === ts.SyntaxKind.Identifier && /^destroy(\$|)$/.test(node.getText()));
      const containsPrivateKeyword = !!prop
        .getChildAt(0)
        .getChildren()
        .filter(node => node.kind === ts.SyntaxKind.PrivateKeyword).length;
      if (name && name.length && !containsPrivateKeyword) {
        this.addFailureAtNode(prop, 'Property should be private.');
      }
    }
  }
}

/**
 * Implementation of the private-destroy-field rule.
 */
export class Rule extends Lint.Rules.AbstractRule {
  apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    return this.applyWithWalker(new PrivateDestroyFieldWalker(sourceFile, this.getOptions()));
  }
}
