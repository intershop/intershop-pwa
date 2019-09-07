"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
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
var Rule = (function (_super) {
    __extends(Rule, _super);
    function Rule(options) {
        var _this = _super.call(this, options) || this;
        _this.patterns = [];
        _this.patterns = options.ruleArguments;
        return _this;
    }
    Rule.prototype.apply = function (sourceFile) {
        var _this = this;
        return this.applyWithFunction(sourceFile, function (ctx) {
            sourceFile.statements
                .filter(function (stm) { return stm.kind === typescript_1.SyntaxKind.ImportDeclaration; })
                .forEach(function (node) {
                _this.visitImportDeclaration(ctx, node);
            });
        });
    };
    Rule.prototype.visitImportDeclaration = function (ctx, importStatement) {
        var fromStringToken = ruleHelpers_1.RuleHelpers.getNextChildTokenOfKind(importStatement, typescript_1.SyntaxKind.StringLiteral);
        var fromStringText = fromStringToken.getText().substring(1, fromStringToken.getText().length - 1);
        this.patterns.forEach(function (pattern) {
            if (new RegExp(pattern.filePattern).test(importStatement.getSourceFile().fileName) &&
                new RegExp(pattern.from).test(fromStringText) &&
                importStatement.getChildAt(1).getChildAt(0)) {
                var importSpecifier = importStatement.getChildAt(1).getChildAt(0);
                var importList = void 0;
                if (importSpecifier.kind === typescript_1.SyntaxKind.Identifier) {
                    importList = [importStatement.getChildAt(1)];
                }
                else if (importSpecifier.kind === typescript_1.SyntaxKind.NamespaceImport && pattern.starImport) {
                    ctx.addFailureAtNode(importStatement, pattern.message || "Star imports from '" + fromStringText + "' are banned.");
                    return;
                }
                else {
                    importList = importSpecifier
                        .getChildAt(1)
                        .getChildren()
                        .filter(function (token) { return token.kind === typescript_1.SyntaxKind.ImportSpecifier; });
                }
                if (pattern.starImport) {
                    return;
                }
                if (pattern.import) {
                    importList
                        .filter(function (token) { return new RegExp(pattern.import).test(token.getText()); })
                        .forEach(function (token) {
                        return ctx.addFailureAtNode(token, pattern.message || "Using '" + token.getText() + "' from '" + fromStringText + "' is banned.");
                    });
                }
                else {
                    var fix = void 0;
                    if (pattern.fix) {
                        fix = new Lint.Replacement(fromStringToken.getStart(), fromStringToken.getWidth(), "'" + fromStringText.replace(new RegExp(pattern.from), pattern.fix) + "'");
                    }
                    ctx.addFailureAtNode(fromStringToken, pattern.message || "Importing from '" + fromStringText + " is banned.", fix);
                }
            }
        });
    };
    return Rule;
}(Lint.Rules.AbstractRule));
exports.Rule = Rule;
