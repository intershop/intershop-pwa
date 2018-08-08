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
var BanSpecificImportsWalker = (function (_super) {
    __extends(BanSpecificImportsWalker, _super);
    function BanSpecificImportsWalker(sourceFile, options) {
        var _this = _super.call(this, sourceFile, options) || this;
        _this.patterns = [];
        _this.patterns = options.ruleArguments;
        return _this;
    }
    BanSpecificImportsWalker.prototype.visitImportDeclaration = function (importStatement) {
        var _this = this;
        var fromStringToken = ruleHelpers_1.RuleHelpers.getNextChildTokenOfKind(importStatement, typescript_1.SyntaxKind.StringLiteral);
        var fromStringText = fromStringToken.getText().substring(1, fromStringToken.getText().length - 1);
        this.patterns.forEach(function (pattern) {
            if (new RegExp(pattern.filePattern).test(importStatement.getSourceFile().fileName) &&
                new RegExp(pattern.from).test(fromStringText)) {
                var importList = importStatement
                    .getChildAt(1)
                    .getChildAt(0)
                    .getChildAt(1);
                if (pattern.starImport) {
                    if (importList.kind === typescript_1.SyntaxKind.AsKeyword) {
                        _this.addFailureAtNode(importStatement, pattern.message || "Star imports from '" + fromStringText + "' are banned.");
                    }
                }
                else if (pattern.import) {
                    importList
                        .getChildren()
                        .filter(function (token) { return token.kind === typescript_1.SyntaxKind.ImportSpecifier; })
                        .filter(function (token) { return new RegExp(pattern.import).test(token.getText()); })
                        .forEach(function (token) {
                        return _this.addFailureAtNode(token, pattern.message || "Using '" + token.getText() + "' from '" + fromStringText + "' is banned.");
                    });
                }
                else {
                    _this.addFailureAtNode(fromStringToken, pattern.message || "Importing from '" + fromStringText + " is banned.");
                }
            }
        });
    };
    return BanSpecificImportsWalker;
}(Lint.RuleWalker));
var Rule = (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rule.prototype.apply = function (sourceFile) {
        return this.applyWithWalker(new BanSpecificImportsWalker(sourceFile, this.getOptions()));
    };
    return Rule;
}(Lint.Rules.AbstractRule));
exports.Rule = Rule;
