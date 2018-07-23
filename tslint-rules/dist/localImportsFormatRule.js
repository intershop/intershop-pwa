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
var LocalImportsFormatPluginWalker = (function (_super) {
    __extends(LocalImportsFormatPluginWalker, _super);
    function LocalImportsFormatPluginWalker() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    LocalImportsFormatPluginWalker.prototype.visitImportDeclaration = function (importStatement) {
        var applyLikeAutoImportPlugin;
        if (this.getOptions()[0] === 'AutoImportPlugin') {
            applyLikeAutoImportPlugin = true;
        }
        else if (this.getOptions()[0] === 'TypeScriptHeroPlugin') {
            applyLikeAutoImportPlugin = false;
        }
        else {
            var message = 'as configuration for local-imports-format rule only "AutoImportPlugin" and "TypeScriptHeroPlugin" are valid values';
            throw new Error(message);
        }
        var token = ruleHelpers_1.RuleHelpers.getNextChildTokenOfKind(importStatement, typescript_1.SyntaxKind.StringLiteral);
        var text = token.getText();
        if (applyLikeAutoImportPlugin) {
            if (text.charAt(1) === '.' && text.charAt(2) !== '/') {
                var replaceString = text.substring(0, 1) + "./" + text.substring(1, text.length);
                var fix = new Lint.Replacement(token.getStart(), token.getWidth(), replaceString);
                this.addFailureAtNode(token, 'local import statements must start with "./", consider using AutoImport Plugin', fix);
            }
        }
        else if (text.substring(1, 4) === './.') {
            var replaceString = text.substring(0, 1) + text.substring(3, text.length);
            var fix = new Lint.Replacement(token.getStart(), token.getWidth(), replaceString);
            this.addFailureAtNode(token, 'local relative import statements must not start with "./", consider using TypeScript Hero Plugin', fix);
        }
    };
    return LocalImportsFormatPluginWalker;
}(Lint.RuleWalker));
var Rule = (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rule.prototype.apply = function (sourceFile) {
        return this.applyWithWalker(new LocalImportsFormatPluginWalker(sourceFile, this.getOptions()));
    };
    return Rule;
}(Lint.Rules.AbstractRule));
exports.Rule = Rule;
