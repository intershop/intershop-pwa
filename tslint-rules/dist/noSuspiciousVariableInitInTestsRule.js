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
var Lint = require("tslint");
var ts = require("typescript");
var ruleHelpers_1 = require("./ruleHelpers");
var NoSuspiciousVariableInitInTestsWalker = (function (_super) {
    __extends(NoSuspiciousVariableInitInTestsWalker, _super);
    function NoSuspiciousVariableInitInTestsWalker(sourceFile, options) {
        var _this = _super.call(this, sourceFile, options) || this;
        _this.excludes = [];
        if (options['ruleArguments'] && options['ruleArguments'][0] && options['ruleArguments'][0]['exclude']) {
            _this.excludes = options['ruleArguments'][0]['exclude'];
        }
        _this.interestingVariables = [];
        _this.correctlyReinitializedVariables = [];
        return _this;
    }
    NoSuspiciousVariableInitInTestsWalker.prototype.visitSourceFile = function (sourceFile) {
        var _this = this;
        if (sourceFile.fileName.endsWith('.spec.ts')) {
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
            var missingReinit = this.interestingVariables
                .filter(function (node) { return _this.correctlyReinitializedVariables.indexOf(ruleHelpers_1.RuleHelpers.extractVariableNameInDeclaration(node)) < 0; })
                .filter(function (node) { return _this.excludes.indexOf(ruleHelpers_1.RuleHelpers.extractVariableNameInDeclaration(node)) < 0; });
            missingReinit.forEach(function (key) {
                return _this.addFailureAtNode(key, 'variable "' + ruleHelpers_1.RuleHelpers.extractVariableNameInDeclaration(key) + '" is not re-initialized in beforeEach');
            });
        }
    };
    NoSuspiciousVariableInitInTestsWalker.prototype.checkVariableStatementsInBeforeEach = function (node) {
        var _this = this;
        node.getChildren().forEach(function (child) {
            var statement = child.getChildAt(0);
            if (statement.getChildCount() > 2 && statement.getChildAt(1).kind === ts.SyntaxKind.EqualsToken) {
                var varName = statement.getChildAt(0).getText();
                _this.correctlyReinitializedVariables.push(varName);
            }
            else if (statement.getText().search('TestBed') >= 0) {
                var testBedStatement = statement.getChildAt(0);
                var possibleThenStatement = testBedStatement.getChildAt(testBedStatement.getChildCount() - 1);
                if (possibleThenStatement && possibleThenStatement.getText() === 'then') {
                    _this.checkVariableStatementsInBeforeEach(statement
                        .getChildAt(2)
                        .getChildAt(0)
                        .getChildAt(4)
                        .getChildAt(1));
                }
            }
        });
    };
    NoSuspiciousVariableInitInTestsWalker.prototype.checkVariableStatementInDescribe = function (statement) {
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
            this.interestingVariables.push(statement);
        }
    };
    return NoSuspiciousVariableInitInTestsWalker;
}(Lint.RuleWalker));
var Rule = (function (_super) {
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
