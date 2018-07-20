import * as Lint from 'tslint';
import * as ts from 'typescript';

class UseAsyncSynchronisationInTestsWalker extends Lint.RuleWalker {
  visitSourceFile(sourceFile: ts.SourceFile) {
    if (sourceFile.fileName.endsWith('.spec.ts')) {
      super.visitSourceFile(sourceFile);
    }
  }

  visitArrowFunction(block: ts.ArrowFunction) {
    if (
      block.parent
        .getChildAt(0)
        .getText()
        .endsWith('.subscribe') &&
      block.getText().search(/\sdone\(\);/) < 0
    ) {
      this.addFailureAtNode(
        block,
        'asynchronous operations in tests should call done callback, see https://facebook.github.io/jest/docs/en/asynchronous.html'
      );
    }
    super.visitArrowFunction(block);
  }
}

/**
 * Implementation of the use-async-synchronisation-in-tests rule.
 */
export class Rule extends Lint.Rules.AbstractRule {
  apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    return this.applyWithWalker(new UseAsyncSynchronisationInTestsWalker(sourceFile, this.getOptions()));
  }
}
