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
var typescript_1 = require("typescript");
var Lint = require("tslint");
var ruleHelpers_1 = require("./ruleHelpers");
var PreferMocksInsteadOfStubsInTestsWalker = (function (_super) {
    __extends(PreferMocksInsteadOfStubsInTestsWalker, _super);
    function PreferMocksInsteadOfStubsInTestsWalker() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PreferMocksInsteadOfStubsInTestsWalker.prototype.visitSourceFile = function (sourceFile) {
        var _this = this;
        if (sourceFile.fileName.search('.spec.ts') > 0) {
            // console.log('####' + sourceFile.fileName);
            // if (!sourceFile.fileName.endsWith('registration-page.component.spec.ts')) {
            //     return;
            // }
            var describeBody = ruleHelpers_1.RuleHelpers.getDescribeBody(sourceFile);
            if (describeBody) {
                describeBody.getChildren().forEach(function (child) {
                    if (child.kind === typescript_1.SyntaxKind.ClassDeclaration) {
                        // console.log(child.kind + ': ' + child.getText());
                        var classNameToken = ruleHelpers_1.RuleHelpers.getNextChildTokenOfKind(child, typescript_1.SyntaxKind.Identifier);
                        if (classNameToken) {
                            var className = classNameToken.getText();
                            if (/.*Stub/.test(className)) {
                                _this.addFailureAtNode(child, 'Do not use stub classes like "' + className +
                                    '". Use the capabilities of ts-mockito instead.');
                            }
                        }
                    }
                });
            }
        }
    };
    return PreferMocksInsteadOfStubsInTestsWalker;
}(Lint.RuleWalker));
/**
 * Implementation of the prefer-mocks-instead-of-stubs-in-tests rule.
 */
var Rule = (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rule.prototype.apply = function (sourceFile) {
        return this.applyWithWalker(new PreferMocksInsteadOfStubsInTestsWalker(sourceFile, this.getOptions()));
    };
    return Rule;
}(Lint.Rules.AbstractRule));
exports.Rule = Rule;
//# sourceMappingURL=preferMocksInsteadOfStubsInTestsRule.js.map