import * as Lint from 'tslint';
import * as ts from 'typescript';

class NgrxUseEmptyStoreTypeWalker extends Lint.RuleWalker {
  visitIdentifier(node: ts.Identifier) {
    if (node.getText() === 'Store') {
      const storeType = node.parent;
      if (storeType.kind === ts.SyntaxKind.TypeReference && storeType.getText() !== 'Store<{}>') {
        const fix = new Lint.Replacement(storeType.getStart(), storeType.getWidth(), 'Store<{}>');
        this.addFailureAtNode(
          storeType,
          'use empty store type (Store<{}>) and use selectors to access the store.',
          fix
        );
      }
    }
  }
}

/**
 * Implementation of the ngrx-use-empty-store-type rule.
 */
export class Rule extends Lint.Rules.AbstractRule {
  apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    return this.applyWithWalker(new NgrxUseEmptyStoreTypeWalker(sourceFile, this.getOptions()));
  }
}
