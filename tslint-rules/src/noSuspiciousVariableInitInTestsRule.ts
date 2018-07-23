import * as Lint from 'tslint';
import * as ts from 'typescript';
import { RuleHelpers } from './ruleHelpers';

class NoSuspiciousVariableInitInTestsWalker extends Lint.RuleWalker {
  // TODO: excludes currently only supported for 'variable X is not re-initialized in beforeEach'
  excludes: string[] = [];
  interestingVariables: ts.Node[];
  correctlyReinitializedVariables: string[];

  constructor(sourceFile: ts.SourceFile, options: Lint.IOptions) {
    super(sourceFile, options);

    if (options.ruleArguments && options.ruleArguments[0] && options.ruleArguments[0].exclude) {
      this.excludes = options.ruleArguments[0].exclude;
    }
    this.interestingVariables = [];
    this.correctlyReinitializedVariables = [];
  }

  visitSourceFile(sourceFile: ts.SourceFile) {
    if (sourceFile.fileName.endsWith('.spec.ts')) {
      const describeBody = RuleHelpers.getDescribeBody(sourceFile);
      if (describeBody) {
        for (let i = 0; i < describeBody.getChildCount(); i++) {
          const child = describeBody.getChildAt(i);
          if (child.kind === ts.SyntaxKind.VariableStatement) {
            this.checkVariableStatementInDescribe(child.getChildAt(0));
          }
          if (child.kind === ts.SyntaxKind.ExpressionStatement && child.getFirstToken().getText() === 'beforeEach') {
            let be = child.getChildAt(0);
            while (be.kind !== ts.SyntaxKind.ArrowFunction) {
              be = be.getChildAt(2).getChildAt(0);
            }
            this.checkVariableStatementsInBeforeEach(be.getChildAt(4).getChildAt(1));
          }
        }
      }

      const missingReinit = this.interestingVariables
        .filter(
          node => this.correctlyReinitializedVariables.indexOf(RuleHelpers.extractVariableNameInDeclaration(node)) < 0
        )
        .filter(node => this.excludes.indexOf(RuleHelpers.extractVariableNameInDeclaration(node)) < 0);

      missingReinit.forEach(key =>
        this.addFailureAtNode(
          key,
          'variable "' + RuleHelpers.extractVariableNameInDeclaration(key) + '" is not re-initialized in beforeEach'
        )
      );
    }
  }

  private checkVariableStatementsInBeforeEach(node: ts.Node) {
    node.getChildren().forEach(child => {
      const statement = child.getChildAt(0);
      if (statement.getChildCount() > 2 && statement.getChildAt(1).kind === ts.SyntaxKind.EqualsToken) {
        const varName = statement.getChildAt(0).getText();
        this.correctlyReinitializedVariables.push(varName);
      } else if (statement.getText().search('TestBed') >= 0) {
        const testBedStatement = statement.getChildAt(0);
        const possibleThenStatement = testBedStatement.getChildAt(testBedStatement.getChildCount() - 1);
        if (possibleThenStatement && possibleThenStatement.getText() === 'then') {
          this.checkVariableStatementsInBeforeEach(
            statement
              .getChildAt(2)
              .getChildAt(0)
              .getChildAt(4)
              .getChildAt(1)
          );
        }
      }
    });
  }

  private checkVariableStatementInDescribe(statement: ts.Node) {
    const newKeywordFound = RuleHelpers.getNextChildTokenOfKind(statement, ts.SyntaxKind.NewKeyword);
    if (newKeywordFound) {
      this.addFailureAtNode(statement, 'Complex statements should only be made in beforeEach.');
    }
    const letKeywordFound = RuleHelpers.getNextChildTokenOfKind(statement, ts.SyntaxKind.LetKeyword);
    const assignmentFound = RuleHelpers.getNextChildTokenOfKind(statement, ts.SyntaxKind.EqualsToken);
    if (letKeywordFound && assignmentFound) {
      this.addFailureAtNode(statement, 'Statement should be const statement or re-initialized in beforeEach');
    } else if (letKeywordFound) {
      this.interestingVariables.push(statement);
    }
  }
}

/**
 * Implementation of the no-suspicious-variable-init-in-tests rule.
 */
export class Rule extends Lint.Rules.AbstractRule {
  apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    return this.applyWithWalker(new NoSuspiciousVariableInitInTestsWalker(sourceFile, this.getOptions()));
  }
}
