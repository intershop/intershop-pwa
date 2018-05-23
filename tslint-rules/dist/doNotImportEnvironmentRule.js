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
var typescript_1 = require("typescript");
var ruleHelpers_1 = require("./ruleHelpers");
var DoNotImportEnvironmentWalker = (function (_super) {
    __extends(DoNotImportEnvironmentWalker, _super);
    function DoNotImportEnvironmentWalker() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DoNotImportEnvironmentWalker.prototype.visitImportDeclaration = function (importStatement) {
        var fromStringToken = ruleHelpers_1.RuleHelpers.getNextChildTokenOfKind(importStatement, typescript_1.SyntaxKind.StringLiteral);
        var fromStringText = fromStringToken.getText();
        if (fromStringText.indexOf('environments/environment') > 0) {
            this.addFailureAtNode(importStatement, 'Importing environment is not allowed. Inject needed properties instead.');
        }
    };
    return DoNotImportEnvironmentWalker;
}(Lint.RuleWalker));
var Rule = (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rule.prototype.apply = function (sourceFile) {
        return this.applyWithWalker(new DoNotImportEnvironmentWalker(sourceFile, this.getOptions()));
    };
    return Rule;
}(Lint.Rules.AbstractRule));
exports.Rule = Rule;
