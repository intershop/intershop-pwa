import * as Lint from 'tslint';
import * as rule from 'tslint/lib/rules/noObjectLiteralTypeAssertionRule';
import * as ts from 'typescript';

export class Rule extends Lint.Rules.AbstractRule {
  private static RULE = new rule.Rule({
    ruleArguments: [],
    ruleSeverity: 'error',
    ruleName: 'ish-no-object-literal-type-assertion',
  } as Lint.IOptions);

  private includePattern = '.*';

  constructor(options: Lint.IOptions) {
    super(options);
    if (options.ruleArguments.length && options.ruleArguments[0]) {
      this.includePattern = options.ruleArguments[0];
    }
  }
  apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    if (new RegExp(this.includePattern).test(sourceFile.fileName)) {
      return Rule.RULE.apply(sourceFile);
    }
    return [];
  }
}
