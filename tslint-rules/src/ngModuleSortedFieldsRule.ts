import { NgWalker } from 'codelyzer/angular/ngWalker';
import * as Lint from 'tslint';
import * as ts from 'typescript';

class NgModulesSortedFieldsWalker extends NgWalker {
  ignoreTokens: string[] = [];

  constructor(sourceFile: ts.SourceFile, options: Lint.IOptions) {
    super(sourceFile, options);

    if (options.ruleArguments && options.ruleArguments[0] && options.ruleArguments[0]['ignore-tokens']) {
      this.ignoreTokens = options.ruleArguments[0]['ignore-tokens'];
    }
  }

  visitCallExpression(node: ts.CallExpression) {
    if (node.getChildAt(0).getText() === 'TestBed.configureTestingModule') {
      const ngModuleDeclarationList = node
        .getChildAt(2)
        .getChildAt(0)
        .getChildAt(1) as ts.SyntaxList;
      this.visitNgModuleDeclarationList(ngModuleDeclarationList);
    }
    super.visitCallExpression(node);
  }

  visitClassDecorator(decorator: ts.Decorator) {
    if (
      decorator
        .getChildAt(1)
        .getChildAt(0)
        .getText() !== 'NgModule'
    ) {
      return;
    }

    decorator
      .getSourceFile()
      .getChildAt(0)
      .getChildren()
      .filter(node => node.kind === ts.SyntaxKind.VariableStatement)
      .map(node => node.getChildAt(0))
      .filter(node => node.kind === ts.SyntaxKind.VariableDeclarationList)
      .map(node => node.getChildAt(1).getChildAt(0))
      // .filter(node => this.assertList(node))
      .forEach(node => this.sortList(node.getChildAt(2).getChildAt(1) as ts.SyntaxList));

    const ngModuleDeclarationList = decorator
      .getChildAt(1)
      .getChildAt(2)
      .getChildAt(0)
      .getChildAt(1) as ts.SyntaxList;
    this.visitNgModuleDeclarationList(ngModuleDeclarationList);

    super.visitClassDecorator(decorator);
  }

  private visitNgModuleDeclarationList(ngModuleDeclarationList: ts.SyntaxList) {
    ngModuleDeclarationList
      .getChildren()
      .filter(node => node.kind !== ts.SyntaxKind.CommaToken)
      .filter(node => /^(exports|imports|declarations|entryComponents)$/.test(node.getChildAt(0).getText()))
      .filter(node => this.assertList(node))
      .forEach(node => {
        this.sortList(node.getChildAt(2).getChildAt(1) as ts.SyntaxList);
      });
  }

  private assertList(node: ts.Node): boolean {
    if (node.getSourceFile().fileName.endsWith('.spec.ts')) {
      return true;
    }
    if (node.getChildCount() < 3 || node.getChildAt(2).kind !== ts.SyntaxKind.ArrayLiteralExpression) {
      this.addFailureAtNode(
        node,
        'Right-hand side is not an array, but it should be for schematics to function properly.'
      );
      return false;
    }
    return true;
  }

  private sortList(list: ts.SyntaxList) {
    const possibleSorted = this.getSortedIfNot(list);
    if (possibleSorted) {
      this.addFailureAtNode(list, 'list is not sorted', Lint.Replacement.replaceNode(list, possibleSorted));
    }
  }

  private getSortedIfNot(list: ts.SyntaxList): string {
    if (!list) {
      return;
    }

    for (const token of this.ignoreTokens) {
      if (list.getFullText().search(token) >= 0) {
        return;
      }
    }

    const sorted = list
      .getChildren()
      .filter(node => node.kind !== ts.SyntaxKind.CommaToken)
      .map(node => node.getFullText())
      .sort((a, b) => (a.trim() > b.trim() ? 1 : a.trim() < b.trim() ? -1 : 0))
      .filter((val, idx, arr) => idx === arr.indexOf(val))
      .join(',');

    if (sorted !== list.getFullText().replace(/,$/, '')) {
      return sorted.replace(/^\n\r?/, '').replace(/^\ */g, '') + (list.getFullText().endsWith(',') ? ',' : '');
    }
    return;
  }
}

/**
 * Implementation of the ng-module-sorted-fields rule.
 */
export class Rule extends Lint.Rules.AbstractRule {
  apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    return this.applyWithWalker(new NgModulesSortedFieldsWalker(sourceFile, this.getOptions()));
  }
}
