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
var tsutils_1 = require("tsutils");
var typescript_1 = require("typescript");
var ruleHelpers_1 = require("./ruleHelpers");
var PreferMocksInsteadOfStubsInTestsWalker = (function (_super) {
    __extends(PreferMocksInsteadOfStubsInTestsWalker, _super);
    function PreferMocksInsteadOfStubsInTestsWalker() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PreferMocksInsteadOfStubsInTestsWalker.prototype.visitSourceFile = function (sourceFile) {
        if (sourceFile.fileName.endsWith('.spec.ts')) {
            _super.prototype.visitSourceFile.call(this, sourceFile);
        }
    };
    PreferMocksInsteadOfStubsInTestsWalker.prototype.visitClassDeclaration = function (node) {
        var classToken = ruleHelpers_1.RuleHelpers.getNextChildTokenOfKind(node, typescript_1.SyntaxKind.ClassKeyword);
        var classNameToken = tsutils_1.getNextToken(classToken);
        var className = classNameToken.getText();
        this.addFailureAtNode(classNameToken, 'Do not use stub classes like "' +
            className +
            '" in tests. Use ts-mockito or reusable testhelper classes instead.');
        _super.prototype.visitClassDeclaration.call(this, node);
    };
    return PreferMocksInsteadOfStubsInTestsWalker;
}(Lint.RuleWalker));
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
