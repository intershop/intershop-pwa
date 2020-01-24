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
var tsquery_1 = require("@phenomnomnominal/tsquery");
var Lint = require("tslint");
var ts = require("typescript");
var ruleHelpers_1 = require("./ruleHelpers");
var Rule = (function (_super) {
    __extends(Rule, _super);
    function Rule(options) {
        var _this = _super.call(this, options) || this;
        _this.ruleSettings = {};
        _this.ruleSettings = options.ruleArguments[0];
        return _this;
    }
    Rule.prototype.apply = function (sourceFile) {
        var _this = this;
        var regex = /\.([\w-]+)\.ts$/;
        if (!regex.test(sourceFile.fileName)) {
            return [];
        }
        var artifact = regex.exec(sourceFile.fileName)[1];
        if (!this.ruleSettings[artifact]) {
            return [];
        }
        return this.applyWithFunction(sourceFile, function (ctx) {
            ctx.sourceFile.statements.filter(ts.isImportDeclaration).forEach(function (importStatement) {
                var fromStringToken = ruleHelpers_1.RuleHelpers.getNextChildTokenOfKind(importStatement, ts.SyntaxKind.StringLiteral);
                var fromStringText = fromStringToken.getText().substring(1, fromStringToken.getText().length - 1);
                var failuteToken = tsquery_1.tsquery(ctx.sourceFile, 'ClassDeclaration > Identifier')[0];
                if (fromStringText.search(/\/store(\/|$)/) >= 0 && !_this.ruleSettings[artifact].ngrx) {
                    ctx.addFailureAtNode(failuteToken, "ngrx handling is not allowed in " + artifact + "s. (found " + importStatement.getText() + ")");
                }
                if (/\/services\/.*\.service$/.test(fromStringText) && !_this.ruleSettings[artifact].service) {
                    ctx.addFailureAtNode(failuteToken, "service usage is not allowed in " + artifact + "s. (found " + importStatement.getText() + ")");
                }
                if (fromStringText.search(/angular\/router/) >= 0 && !_this.ruleSettings[artifact].router) {
                    ctx.addFailureAtNode(failuteToken, "router usage is not allowed in " + artifact + "s. (found " + importStatement.getText() + ")");
                }
                if (fromStringText.search(/\/facades(\/|$)/) >= 0 && !_this.ruleSettings[artifact].facade) {
                    ctx.addFailureAtNode(failuteToken, "using facades is not allowed in " + artifact + "s. (found " + importStatement.getText() + ")");
                }
            });
        });
    };
    return Rule;
}(Lint.Rules.AbstractRule));
exports.Rule = Rule;
