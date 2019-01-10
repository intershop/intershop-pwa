import * as Lint from 'tslint';
import * as rule from 'tslint/lib/rules/noObjectLiteralTypeAssertionRule';
import * as ts from 'typescript';

class IshNoObjectLiteralTypeAssertionWalker extends Lint.RuleWalker {
  private static RULE = new rule.Rule({
    ruleArguments: [],
    ruleSeverity: 'error',
    ruleName: 'ish-no-object-literal-type-assertion',
  } as Lint.IOptions);
  private includePattern = '.*';

  constructor(sourceFile: ts.SourceFile, options: Lint.IOptions) {
    super(sourceFile, options);
    if (options.ruleArguments.length && options.ruleArguments[0]) {
      this.includePattern = options.ruleArguments[0];
    }
  }

  visitSourceFile(sourceFile: ts.SourceFile) {
    if (new RegExp(this.includePattern).test(sourceFile.fileName)) {
      const failures = IshNoObjectLiteralTypeAssertionWalker.RULE.apply(sourceFile);
      failures.forEach(f => this.addFailure(f));
    }
  }
}

/**
 * Implementation of the ish-no-object-literal-type-assertion rule.
 */
export class Rule extends Lint.Rules.AbstractRule {
  apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    return this.applyWithWalker(new IshNoObjectLiteralTypeAssertionWalker(sourceFile, this.getOptions()));
  }
}
