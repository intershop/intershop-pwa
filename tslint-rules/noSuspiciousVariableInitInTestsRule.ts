import * as Lint from 'tslint';
import * as ts from 'typescript';
import { RuleHelpers } from './ruleHelpers';

class NoSuspiciousVariableInitInTestsWalker extends Lint.RuleWalker {

  interestingVariables: ts.Node[];
  correctlyReinitializedVariables: string[];

  public visitSourceFile(sourceFile: ts.SourceFile) {
    this.interestingVariables = [];
    this.correctlyReinitializedVariables = [];

    if (sourceFile.fileName.search('.spec.ts') > 0) {
      // if (!sourceFile.fileName.endsWith('account-login.component.spec.ts')) {
      //     return;
      // }
      // console.log('####' + sourceFile.fileName);
      const describeBody = RuleHelpers.getDescribeBody(sourceFile);
      if (describeBody) {
        for (let i = 0; i < describeBody.getChildCount(); i++) {
          const child: ts.Node = describeBody.getChildAt(i);
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

      const missingReinit = this.interestingVariables.filter(node => this.correctlyReinitializedVariables.indexOf(RuleHelpers.extractVariableNameInDeclaration(node)) < 0);
      missingReinit.forEach(key => this.addFailureAtNode(key, 'variable "' + RuleHelpers.extractVariableNameInDeclaration(key) + '" is not re-initialized in beforeEach'));
    }
  }

  private checkVariableStatementsInBeforeEach(node: ts.Node) {
    node.getChildren().forEach(child => {
      const statement = child.getChildAt(0);
      // RuleHelpers.dumpNode(statement);
      if (statement.getChildCount() > 2 && statement.getChildAt(1).kind === ts.SyntaxKind.EqualsToken) {
        const varName = statement.getChildAt(0).getText();
        // console.log('found assignment on "' + varName + '" in beforeEach');
        this.correctlyReinitializedVariables.push(varName);
      } else if (statement.getText().search('TestBed') >= 0) {
        const testBedStatement = statement.getChildAt(0);
        const possibleThenStatement = testBedStatement.getChildAt(testBedStatement.getChildCount() - 1);
        if (possibleThenStatement && possibleThenStatement.getText() === 'then') {
          this.checkVariableStatementsInBeforeEach(statement.getChildAt(2).getChildAt(0).getChildAt(4).getChildAt(1));
        }
      }
    });
  }

  private checkVariableStatementInDescribe(statement: ts.Node) {
    // helpers.dumpNode(statement);
    const newKeywordFound = RuleHelpers.getNextChildTokenOfKind(statement, ts.SyntaxKind.NewKeyword);
    if (newKeywordFound) {
      this.addFailureAtNode(statement, 'Complex statements should only be made in beforeEach.');
    }
    const letKeywordFound = RuleHelpers.getNextChildTokenOfKind(statement, ts.SyntaxKind.LetKeyword);
    const assignmentFound = RuleHelpers.getNextChildTokenOfKind(statement, ts.SyntaxKind.EqualsToken);
    if (letKeywordFound && assignmentFound) {
      this.addFailureAtNode(statement, 'Statement should be const statement or re-initialized in beforeEach');
    } else if (letKeywordFound) {
      // const varName = RuleHelpers.extractVariableNameInDeclaration(statement);
      // console.log('interested in "' + varName + '"');
      this.interestingVariables.push(statement);
    }
  }
}

/**
 * Implementation of the no-suspicious-variable-init-in-tests rule.
 */
export class Rule extends Lint.Rules.AbstractRule {

  public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    return this.applyWithWalker(new NoSuspiciousVariableInitInTestsWalker(sourceFile, this.getOptions()));
  }
}
