import { NgWalker } from 'codelyzer/angular/ngWalker';
import * as Lint from 'tslint';
import * as cc from 'tslint/lib/rules/cyclomaticComplexityRule';
import { getTokenAtPosition } from 'tsutils';
import * as ts from 'typescript';

class LifecycleCyclomaticComplexityWalker extends NgWalker {
  private complexity = {};

  constructor(sourceFile: ts.SourceFile, options: Lint.IOptions) {
    super(sourceFile, options);
    if (options.ruleArguments.length && options.ruleArguments[0]) {
      this.complexity = options.ruleArguments[0];
    }
  }

  visitClassDecorator(decorator: ts.Decorator) {
    const type = decorator
      .getChildAt(1)
      .getChildAt(0)
      .getText();

    // tslint:disable-next-line:prefer-switch
    if (type === 'Component' || type === 'Directive' || type === 'Pipe') {
      const failures = new cc.Rule({ ruleArguments: [1] } as Lint.IOptions).apply(decorator.getSourceFile());

      failures.forEach(f => {
        const methodIdentifier = getTokenAtPosition(decorator.getSourceFile(), f.getStartPosition().getPosition());
        const methodIdentifierText = methodIdentifier.getText();
        if (methodIdentifierText.startsWith('ngOn')) {
          const threshold = this.complexity[methodIdentifierText] || 1;
          const match = f.getFailure().match(new RegExp('has a cyclomatic complexity of ([0-9]+) which'));
          const actualCC = Number.parseInt(match[1], 10) || 999;
          if (actualCC > threshold) {
            this.addFailureAtNode(
              methodIdentifier,
              `The function ${methodIdentifierText} has a cyclomatic complexity of ${actualCC} which is higher than the threshold of ${threshold}`
            );
          }
        }
      });
    }
  }
}

/**
 * Implementation of the lifecycle-cyclomatic-complexity rule.
 */
export class Rule extends Lint.Rules.AbstractRule {
  apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    return this.applyWithWalker(new LifecycleCyclomaticComplexityWalker(sourceFile, this.getOptions()));
  }
}
