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
  isContainer: boolean;

  constructor(options: Lint.IOptions) {
    super(options);

    this.ruleSettings.component = options.ruleArguments[0].component;
    this.ruleSettings.container = options.ruleArguments[0].container;
  }

  apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    if (!sourceFile.fileName.match(/.*(component|container)\.ts/)) {
      return [];
    }
    return this.applyWithFunction(sourceFile, ctx => {
      this.isContainer = ctx.sourceFile.fileName.indexOf('container') >= 0;
      ctx.sourceFile.statements.filter(ts.isImportDeclaration).forEach((importStatement: ts.ImportDeclaration) => {
        const fromStringToken = RuleHelpers.getNextChildTokenOfKind(importStatement, ts.SyntaxKind.StringLiteral);
        const fromStringText = fromStringToken.getText().substring(1, fromStringToken.getText().length - 1);

        let c: string;
        if (this.isContainer) {
          c = 'container';
        } else {
          c = 'component';
        }

        const failuteToken = tsquery(ctx.sourceFile, 'ClassDeclaration > Identifier')[0];

        if (fromStringText.search(/\/store(\/|$)/) >= 0 && !this.ruleSettings[c].ngrx) {
          ctx.addFailureAtNode(
            failuteToken,
            `ngrx handling is not allowed in ${c}s. (found ${importStatement.getText()})`
          );
        }
        if (fromStringText.search(/\.service$/) >= 0 && !this.ruleSettings[c].service) {
          ctx.addFailureAtNode(
            failuteToken,
            `service usage is not allowed in ${c}s. (found ${importStatement.getText()})`
          );
        }
        if (fromStringText.search(/angular\/router/) >= 0 && !this.ruleSettings[c].router) {
          ctx.addFailureAtNode(
            failuteToken,
            `router usage is not allowed in ${c}s. (found ${importStatement.getText()})`
          );
        }
        if (fromStringText.search(/\/facades(\/|$)/) >= 0 && !this.ruleSettings[c].facade) {
          ctx.addFailureAtNode(
            failuteToken,
            `using facades is not allowed in ${c}s. (found ${importStatement.getText()})`
          );
        }
      });
    });
  }
}
