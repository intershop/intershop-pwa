"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var ts = require("typescript");
var Lint = require("tslint");
var ruleHelpers_1 = require("./ruleHelpers");
var NoSuspiciousVariableInitInTestsWalker = /** @class */ (function (_super) {
    __extends(NoSuspiciousVariableInitInTestsWalker, _super);
    function NoSuspiciousVariableInitInTestsWalker() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NoSuspiciousVariableInitInTestsWalker.prototype.visitSourceFile = function (sourceFile) {
        var _this = this;
        this.interestingVariables = [];
        this.correctlyReinitializedVariables = [];
        if (sourceFile.fileName.search('.spec.ts') > 0) {
            // if (!sourceFile.fileName.endsWith('account-login.component.spec.ts')) {
            //     return;
            // }
            // console.log('####' + sourceFile.fileName);
            var describeBody = ruleHelpers_1.RuleHelpers.getDescribeBody(sourceFile);
            if (describeBody) {
                for (var i = 0; i < describeBody.getChildCount(); i++) {
                    var child = describeBody.getChildAt(i);
                    if (child.kind === ts.SyntaxKind.VariableStatement) {
                        this.checkVariableStatementInDescribe(child.getChildAt(0));
                    }
                    if (child.kind === ts.SyntaxKind.ExpressionStatement && child.getFirstToken().getText() === 'beforeEach') {
                        var be = child.getChildAt(0);
                        while (be.kind !== ts.SyntaxKind.ArrowFunction) {
                            be = be.getChildAt(2).getChildAt(0);
                        }
                        this.checkVariableStatementsInBeforeEach(be.getChildAt(4).getChildAt(1));
                    }
                }
            }
            var missingReinit = this.interestingVariables.filter(function (node) { return _this.correctlyReinitializedVariables.indexOf(ruleHelpers_1.RuleHelpers.extractVariableNameInDeclaration(node)) < 0; });
            missingReinit.forEach(function (key) { return _this.addFailureAtNode(key, 'variable "' + ruleHelpers_1.RuleHelpers.extractVariableNameInDeclaration(key) + '" is not re-initialized in beforeEach'); });
        }
    };
    NoSuspiciousVariableInitInTestsWalker.prototype.checkVariableStatementsInBeforeEach = function (node) {
        var _this = this;
        node.getChildren().forEach(function (child) {
            var statement = child.getChildAt(0);
            // RuleHelpers.dumpNode(statement);
            if (statement.getChildCount() > 2 && statement.getChildAt(1).kind === ts.SyntaxKind.EqualsToken) {
                var varName = statement.getChildAt(0).getText();
                // console.log('found assignment on "' + varName + '" in beforeEach');
                _this.correctlyReinitializedVariables.push(varName);
            }
            else if (statement.getText().search('TestBed') >= 0) {
                var testBedStatement = statement.getChildAt(0);
                var possibleThenStatement = testBedStatement.getChildAt(testBedStatement.getChildCount() - 1);
                if (possibleThenStatement && possibleThenStatement.getText() === 'then') {
                    _this.checkVariableStatementsInBeforeEach(statement.getChildAt(2).getChildAt(0).getChildAt(4).getChildAt(1));
                }
            }
        });
    };
    NoSuspiciousVariableInitInTestsWalker.prototype.checkVariableStatementInDescribe = function (statement) {
        // helpers.dumpNode(statement);
        var newKeywordFound = ruleHelpers_1.RuleHelpers.getNextChildTokenOfKind(statement, ts.SyntaxKind.NewKeyword);
        if (newKeywordFound) {
            this.addFailureAtNode(statement, 'Complex statements should only be made in beforeEach.');
        }
        var letKeywordFound = ruleHelpers_1.RuleHelpers.getNextChildTokenOfKind(statement, ts.SyntaxKind.LetKeyword);
        var assignmentFound = ruleHelpers_1.RuleHelpers.getNextChildTokenOfKind(statement, ts.SyntaxKind.EqualsToken);
        if (letKeywordFound && assignmentFound) {
            this.addFailureAtNode(statement, 'Statement should be const statement or re-initialized in beforeEach');
        }
        else if (letKeywordFound) {
            var varName = ruleHelpers_1.RuleHelpers.extractVariableNameInDeclaration(statement);
            // console.log('interested in "' + varName + '"');
            this.interestingVariables.push(statement);
        }
    };
    return NoSuspiciousVariableInitInTestsWalker;
}(Lint.RuleWalker));
/**
 * Implementation of the no-suspicious-variable-init-in-tests rule.
 */
var Rule = /** @class */ (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rule.prototype.apply = function (sourceFile) {
        return this.applyWithWalker(new NoSuspiciousVariableInitInTestsWalker(sourceFile, this.getOptions()));
    };
    return Rule;
}(Lint.Rules.AbstractRule));
exports.Rule = Rule;
//# sourceMappingURL=noSuspiciousVariableInitInTestsRule.js.map