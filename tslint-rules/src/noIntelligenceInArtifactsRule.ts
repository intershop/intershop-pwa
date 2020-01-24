import { tsquery } from '@phenomnomnominal/tsquery';
import * as Lint from 'tslint';
import * as ts from 'typescript';

import { RuleHelpers } from './ruleHelpers';

interface RuleSetting {
  ngrx: boolean;
  service: boolean;
  router: boolean;
  facade: boolean;
}

export class Rule extends Lint.Rules.AbstractRule {
  ruleSettings: { [key: string]: RuleSetting } = {};

  constructor(options: Lint.IOptions) {
    super(options);

    this.ruleSettings = options.ruleArguments[0];
  }

  apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    const regex = /\.([\w-]+)\.ts$/;
    if (!regex.test(sourceFile.fileName)) {
      return [];
    }

    const artifact = regex.exec(sourceFile.fileName)[1];
    if (!this.ruleSettings[artifact]) {
      return [];
    }

    return this.applyWithFunction(sourceFile, ctx => {
      ctx.sourceFile.statements.filter(ts.isImportDeclaration).forEach((importStatement: ts.ImportDeclaration) => {
        const fromStringToken = RuleHelpers.getNextChildTokenOfKind(importStatement, ts.SyntaxKind.StringLiteral);
        const fromStringText = fromStringToken.getText().substring(1, fromStringToken.getText().length - 1);

        const failuteToken = tsquery(ctx.sourceFile, 'ClassDeclaration > Identifier')[0];

        if (fromStringText.search(/\/store(\/|$)/) >= 0 && !this.ruleSettings[artifact].ngrx) {
          ctx.addFailureAtNode(
            failuteToken,
            `ngrx handling is not allowed in ${artifact}s. (found ${importStatement.getText()})`
          );
        }
        if (/\/services\/.*\.service$/.test(fromStringText) && !this.ruleSettings[artifact].service) {
          ctx.addFailureAtNode(
            failuteToken,
            `service usage is not allowed in ${artifact}s. (found ${importStatement.getText()})`
          );
        }
        if (fromStringText.search(/angular\/router/) >= 0 && !this.ruleSettings[artifact].router) {
          ctx.addFailureAtNode(
            failuteToken,
            `router usage is not allowed in ${artifact}s. (found ${importStatement.getText()})`
          );
        }
        if (fromStringText.search(/\/facades(\/|$)/) >= 0 && !this.ruleSettings[artifact].facade) {
          ctx.addFailureAtNode(
            failuteToken,
            `using facades is not allowed in ${artifact}s. (found ${importStatement.getText()})`
          );
        }
      });
    });
  }
}
