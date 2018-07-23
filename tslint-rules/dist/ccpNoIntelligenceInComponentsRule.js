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
var CCPNoIntelligenceInComponentsWalker = (function (_super) {
    __extends(CCPNoIntelligenceInComponentsWalker, _super);
    function CCPNoIntelligenceInComponentsWalker(sourceFile, options) {
        var _this = _super.call(this, sourceFile, options) || this;
        _this.ruleSettings = {};
        _this.ruleSettings.component = options.ruleArguments[0].component;
        _this.ruleSettings.container = options.ruleArguments[0].container;
        return _this;
    }
    CCPNoIntelligenceInComponentsWalker.prototype.visitSourceFile = function (sourceFile) {
        if (sourceFile.fileName.match(/.*\/(components|containers)\/(?!.*(interface|index|spec|module).ts$).*.ts/)) {
            this.isContainer = sourceFile.fileName.indexOf('/containers/') >= 0;
            _super.prototype.visitSourceFile.call(this, sourceFile);
        }
    };
    CCPNoIntelligenceInComponentsWalker.prototype.visitImportDeclaration = function (importStatement) {
        var fromStringToken = ruleHelpers_1.RuleHelpers.getNextChildTokenOfKind(importStatement, typescript_1.SyntaxKind.StringLiteral);
        var fromStringText = fromStringToken.getText().substring(1, fromStringToken.getText().length - 1);
        var c;
        if (this.isContainer) {
            c = 'container';
        }
        else {
            c = 'component';
        }
        if (fromStringText.search(/\/store(\/|$)/) > 0 && !this.ruleSettings[c].ngrx) {
            this.addFailureAtNode(importStatement, "ngrx handling is not allowed in " + c + "s. (found " + importStatement.getText() + ")");
        }
        if (fromStringText.search(/\.service$/) > 0 && !this.ruleSettings[c].service) {
            this.addFailureAtNode(importStatement, "service usage is not allowed in " + c + "s. (found " + importStatement.getText() + ")");
        }
    };
    return CCPNoIntelligenceInComponentsWalker;
}(Lint.RuleWalker));
var Rule = (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rule.prototype.apply = function (sourceFile) {
        return this.applyWithWalker(new CCPNoIntelligenceInComponentsWalker(sourceFile, this.getOptions()));
    };
    return Rule;
}(Lint.Rules.AbstractRule));
exports.Rule = Rule;
