import { tsquery } from '@phenomnomnominal/tsquery';
import * as Lint from 'tslint';
import * as ts from 'typescript';

export class Rule extends Lint.Rules.AbstractRule {
  apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    return this.applyWithFunction(sourceFile, ctx => {
      tsquery(sourceFile, 'TypeReference:has(Identifier[name="Store"])').forEach(typeReference => {
        if (typeReference.getText() !== 'Store') {
          const fix = new Lint.Replacement(typeReference.getStart(), typeReference.getWidth(), 'Store');
          ctx.addFailureAtNode(typeReference, 'do not use generic store type, use selectors to access the store.', fix);
        }
      });
    });
  }
}
