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
var ts = require("typescript");
var NgrxUseOftypeWithTypeWalker = (function (_super) {
    __extends(NgrxUseOftypeWithTypeWalker, _super);
    function NgrxUseOftypeWithTypeWalker() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NgrxUseOftypeWithTypeWalker.prototype.visitIdentifier = function (node) {
        if (node.getText() === 'ofType') {
            var ofTypeOperatorStatement = node.parent;
            if (!!ofTypeOperatorStatement &&
                ofTypeOperatorStatement.kind === ts.SyntaxKind.CallExpression &&
                ofTypeOperatorStatement.getChildCount() > 2 &&
                ofTypeOperatorStatement.getChildAt(1).getText() !== '<') {
                var followedOperator = tsutils_1.getNextToken(tsutils_1.getNextToken(ofTypeOperatorStatement));
                if (/^(m|switchM|flatM|concatM|exhaustM|mergeM)ap$/.test(followedOperator.getText())) {
                    var followedOperatorBody = followedOperator.parent.getChildAt(2).getChildAt(0);
                    if (!followedOperatorBody.getText().startsWith('()')) {
                        this.addFailureAtNode(ofTypeOperatorStatement.getChildAt(0), 'use ofType operator with specific action type');
                    }
                }
            }
        }
    };
    return NgrxUseOftypeWithTypeWalker;
}(Lint.RuleWalker));
var Rule = (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rule.prototype.apply = function (sourceFile) {
        return this.applyWithWalker(new NgrxUseOftypeWithTypeWalker(sourceFile, this.getOptions()));
    };
    return Rule;
}(Lint.Rules.AbstractRule));
exports.Rule = Rule;
