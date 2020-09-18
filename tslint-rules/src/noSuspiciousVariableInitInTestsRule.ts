import * as Lint from 'tslint';
import * as ts from 'typescript';

import { RuleHelpers } from './ruleHelpers';

export class Rule extends Lint.Rules.AbstractRule {
  /**
   * TODO: excludes currently only supported for 'variable X is not re-initialized in beforeEach'
   */
  excludes: string[] = [];
  interestingVariables: ts.Node[];
  correctlyReinitializedVariables: string[];

  constructor(options: Lint.IOptions) {
    super(options);

    if (options.ruleArguments && options.ruleArguments[0] && options.ruleArguments[0].exclude) {
      this.excludes = options.ruleArguments[0].exclude;
    }
    this.interestingVariables = [];
    this.correctlyReinitializedVariables = [];
  }
  apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    if (!sourceFile.fileName.endsWith('.spec.ts')) {
      return [];
    }

    return this.applyWithFunction(sourceFile, ctx => {
      const describeBody = RuleHelpers.getDescribeBody(sourceFile);
      if (describeBody) {
        for (let i = 0; i < describeBody.getChildCount(); i++) {
          const child = describeBody.getChildAt(i);
          if (child.kind === ts.SyntaxKind.VariableStatement) {
            this.checkVariableStatementInDescribe(ctx, child.getChildAt(0));
          }
          if (child.kind === ts.SyntaxKind.ExpressionStatement && child.getFirstToken().getText() === 'beforeEach') {
            let be = child.getChildAt(0);
            while (be.kind !== ts.SyntaxKind.ArrowFunction) {
              be = be.getChildAt(2).getChildAt(0);
            }
            this.checkVariableStatementsInBeforeEach(
              be
                .getChildren()
                .find(node => node.kind === ts.SyntaxKind.Block)
                .getChildAt(1)
            );
          }
        }
      }

      const missingReinit = this.interestingVariables
        .filter(
          node => this.correctlyReinitializedVariables.indexOf(RuleHelpers.extractVariableNameInDeclaration(node)) < 0
        )
        .filter(node => this.excludes.indexOf(RuleHelpers.extractVariableNameInDeclaration(node)) < 0);

      missingReinit.forEach(key =>
        ctx.addFailureAtNode(
          key,
          `variable "${RuleHelpers.extractVariableNameInDeclaration(key)}" is not re-initialized in beforeEach`
        )
      );
    });
  }

  private checkVariableStatementsInBeforeEach(node: ts.Node) {
    node.getChildren().forEach(child => {
      const statement = child.getChildAt(0);
      if (statement.getChildCount() > 2 && statement.getChildAt(1).kind === ts.SyntaxKind.EqualsToken) {
        const varName = statement.getChildAt(0).getText();
        this.correctlyReinitializedVariables.push(varName);
      }
    });
  }

  private checkVariableStatementInDescribe(ctx: Lint.WalkContext<void>, statement: ts.Node) {
    const newKeywordFound = RuleHelpers.getNextChildTokenOfKind(statement, ts.SyntaxKind.NewKeyword);
    if (newKeywordFound) {
      ctx.addFailureAtNode(statement, 'Complex statements should only be made in beforeEach.');
    }
    const letKeywordFound = RuleHelpers.getNextChildTokenOfKind(statement, ts.SyntaxKind.LetKeyword);
    const assignmentFound = RuleHelpers.getNextChildTokenOfKind(statement, ts.SyntaxKind.EqualsToken);
    if (letKeywordFound && assignmentFound) {
      ctx.addFailureAtNode(statement, 'Statement should be const statement or re-initialized in beforeEach');
    } else if (letKeywordFound) {
      this.interestingVariables.push(statement);
    }
  }
}
