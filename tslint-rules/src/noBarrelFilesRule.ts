import * as Lint from 'tslint';
import { SourceFile } from 'typescript';

export class Rule extends Lint.Rules.AbstractRule {
  apply(sourceFile: SourceFile): Lint.RuleFailure[] {
    return this.applyWithFunction(sourceFile, ctx => {
      if (sourceFile.fileName.search('index.ts') > 0) {
        ctx.addFailureAt(0, 1, 'The use of barrel files is deprecated!');
      }
    });
  }
}
