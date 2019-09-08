import { tsquery } from '@phenomnomnominal/tsquery';
import * as Lint from 'tslint';
import { PropertyAssignment, SourceFile } from 'typescript';

export class Rule extends Lint.Rules.AbstractRule {
  apply(sourceFile: SourceFile): Lint.RuleFailure[] {
    if (!sourceFile.fileName.match(/.*\/environment[\.\w]*\.ts/)) {
      return [];
    }
    return this.applyWithFunction(sourceFile, ctx => {
      tsquery(sourceFile, 'PropertyAssignment').forEach((token: PropertyAssignment) => {
        const identifier = token.name.getText();
        if (!identifier.match(/^[a-z][A-Za-z0-9]*$/)) {
          ctx.addFailureAtNode(token, `Property ${token.getText()} is not camelCase formatted.`);
        }
      });
    });
  }
}
