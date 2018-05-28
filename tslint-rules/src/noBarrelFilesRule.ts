import * as Lint from 'tslint';
import { SourceFile } from 'typescript';

class NoBarrelFilesWalker extends Lint.RuleWalker {
  visitSourceFile(sourceFile: SourceFile) {
    if (sourceFile.fileName.search('index.ts') > 0) {
      this.addFailureAt(0, 1, 'The use of barrel files is deprecated!');
    }
  }
}

/**
 * Implementation of the no-barrel-files rule.
 */
export class Rule extends Lint.Rules.AbstractRule {
  apply(sourceFile: SourceFile): Lint.RuleFailure[] {
    return this.applyWithWalker(new NoBarrelFilesWalker(sourceFile, this.getOptions()));
  }
}
