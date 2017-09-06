import * as ts from 'typescript';
import * as Lint from 'tslint';
import { forEachToken, getNextToken, getChildOfKind } from 'tsutils';

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
            const statements = sourceFile.statements.filter(
                (stmt) => stmt.kind === ts.SyntaxKind.ExpressionStatement && stmt.getFirstToken().getText() === 'describe' );
            if (statements.length && statements[0].getChildAt(0)) {
                const describeStatement: ts.Node = statements[0].getChildAt(0).getChildAt(2);
                const describeBody = describeStatement.getChildAt(2).getChildAt(4).getChildAt(1);

                for (let i = 0; i < describeBody.getChildCount() ; i++) {
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

            const missingReinit = this.interestingVariables.filter(node => this.correctlyReinitializedVariables.indexOf(this.extractVariableNameInDeclaration(node)) < 0);
            missingReinit.forEach(key => this.addFailureAtNode(key, 'variable "' + this.extractVariableNameInDeclaration(key) + '" is not re-initialized in beforeEach'));
        }
    }

    private checkVariableStatementsInBeforeEach(node: ts.Node) {
        node.getChildren().forEach(child => {
            const statement = child.getChildAt(0);
            // this.dump(statement);
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
        // this.dump(statement);
        const newKeywordFound = this.getNextTokenOfKind(statement, ts.SyntaxKind.NewKeyword);
        if (newKeywordFound) {
            this.addFailureAtNode(statement, 'Complex statements should only be made in beforeEach.');
        }
        const letKeywordFound = this.getNextTokenOfKind(statement, ts.SyntaxKind.LetKeyword);
        const assignmentFound = this.getNextTokenOfKind(statement, ts.SyntaxKind.EqualsToken);
        if (letKeywordFound && assignmentFound) {
            this.addFailureAtNode(statement, 'Statement should be const statement or re-initialized in beforeEach');
        } else if (letKeywordFound) {
            const varName = this.extractVariableNameInDeclaration(statement);
            // console.log('interested in "' + varName + '"');
            this.interestingVariables.push(statement);
        }
    }

    private extractVariableNameInDeclaration(statement: ts.Node): string {
        return statement.getChildAt(1).getFirstToken().getText();
    }

    private getNextTokenOfKind(node: ts.Node, kind: ts.SyntaxKind): ts.Node {
        let pointer: ts.Node = node.getFirstToken();
        while (pointer && pointer.kind !== kind) {
            if (pointer === node.getLastToken()) {
                return null;
            }
            pointer = getNextToken(pointer);
        }
        return pointer;
    }

    private dump(node: ts.Node, dumpTokens: boolean = false) {
        if (node) {
            console.log('----------------------------------------');
            console.log('type: ' + node.kind);
            console.log('text: ' + node.getText());
            console.log('child count: ' + node.getChildCount());
            for (let index = 0; index < node.getChildCount() ; index++) {
                const c: ts.Node = node.getChildAt(index);
                console.log('child #' + index + ' ' + c.kind + ': ' + c.getText());
            }
            if (dumpTokens) {
            let pointer = node.getFirstToken();
            while (pointer !== node.getLastToken()) {
                console.log(pointer.kind + ':' + pointer.getText());
                pointer = getNextToken(pointer);
            }
            if (pointer) {
                console.log(pointer.kind + ':' + pointer.getText());
            }
        }
        } else {
            console.log(node);
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
