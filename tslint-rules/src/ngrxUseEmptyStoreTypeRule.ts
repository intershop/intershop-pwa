import { tsquery } from '@phenomnomnominal/tsquery';
import * as Lint from 'tslint';
import * as ts from 'typescript';

export class Rule extends Lint.Rules.AbstractRule {
  apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    return this.applyWithFunction(sourceFile, ctx => {
      tsquery(sourceFile, 'Identifier[name="Store"]').forEach(node => {
        const storeType = node.parent;
        if (storeType.kind === ts.SyntaxKind.TypeReference && storeType.getText() !== 'Store<{}>') {
          const fix = new Lint.Replacement(storeType.getStart(), storeType.getWidth(), 'Store<{}>');
          ctx.addFailureAtNode(
            storeType,
            'use empty store type (Store<{}>) and use selectors to access the store.',
            fix
          );
        }
      });
    });
  }
}
