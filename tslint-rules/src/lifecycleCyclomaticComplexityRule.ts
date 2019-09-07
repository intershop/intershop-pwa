import * as Lint from 'tslint';
import * as cc from 'tslint/lib/rules/cyclomaticComplexityRule';
import { getTokenAtPosition } from 'tsutils';
import * as ts from 'typescript';

export class Rule extends Lint.Rules.AbstractRule {
  private complexity = {};

  constructor(options: Lint.IOptions) {
    super(options);
    if (options.ruleArguments.length && options.ruleArguments[0]) {
      this.complexity = options.ruleArguments[0];
    }
  }

  apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    if (sourceFile.fileName.search(/.(component|container|pipe|directive).ts/) < 0) {
      return [];
    }
    return this.applyWithFunction(sourceFile, ctx => {
      const failures = new cc.Rule({ ruleArguments: [1] } as Lint.IOptions).apply(sourceFile);

      failures.forEach(f => {
        const methodIdentifier = getTokenAtPosition(sourceFile, f.getStartPosition().getPosition());
        const methodIdentifierText = methodIdentifier.getText();
        if (methodIdentifierText.startsWith('ngOn')) {
          const threshold = this.complexity[methodIdentifierText] || 1;
          const match = f.getFailure().match(new RegExp('has a cyclomatic complexity of ([0-9]+) which'));
          const actualCC = Number.parseInt(match[1], 10) || 999;
          if (actualCC > threshold) {
            ctx.addFailureAtNode(
              methodIdentifier,
              `The function ${methodIdentifierText} has a cyclomatic complexity of ${actualCC} which is higher than the threshold of ${threshold}`
            );
          }
        }
      });
    });
  }
}
