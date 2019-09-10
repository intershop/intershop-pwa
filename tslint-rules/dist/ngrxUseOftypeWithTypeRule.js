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
var tsutils_1 = require("tsutils");
var ts = require("typescript");
var Rule = (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rule.prototype.apply = function (sourceFile) {
        return this.applyWithFunction(sourceFile, function (ctx) {
            tsquery_1.tsquery(ctx.sourceFile, 'Identifier[name="ofType"]').forEach(function (node) {
                var ofTypeOperatorStatement = node.parent;
                if (!!ofTypeOperatorStatement &&
                    ofTypeOperatorStatement.kind === ts.SyntaxKind.CallExpression &&
                    ofTypeOperatorStatement.getChildCount() > 2 &&
                    ofTypeOperatorStatement.getChildAt(1).getText() !== '<') {
                    var followedOperator = tsutils_1.getNextToken(tsutils_1.getNextToken(ofTypeOperatorStatement));
                    if (/^(m|switchM|flatM|concatM|exhaustM|mergeM)ap$/.test(followedOperator.getText())) {
                        var followedOperatorBody = followedOperator.parent.getChildAt(2).getChildAt(0);
                        if (!followedOperatorBody.getText().startsWith('()')) {
                            ctx.addFailureAtNode(ofTypeOperatorStatement.getChildAt(0), 'use ofType operator with specific action type');
                        }
                    }
                }
            });
        });
    };
    return Rule;
}(Lint.Rules.AbstractRule));
exports.Rule = Rule;
