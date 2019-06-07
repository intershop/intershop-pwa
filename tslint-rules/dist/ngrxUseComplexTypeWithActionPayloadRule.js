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
var NgrxUseComplexTypeWithActionPayloadWalker = (function (_super) {
    __extends(NgrxUseComplexTypeWithActionPayloadWalker, _super);
    function NgrxUseComplexTypeWithActionPayloadWalker() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NgrxUseComplexTypeWithActionPayloadWalker.prototype.visitCallExpression = function (node) {
        _super.prototype.visitCallExpression.call(this, node);
        if (node.getChildAt(0).getText() === 'action') {
            if (node.getChildAt(2).getChildCount() > 3) {
                this.addFailureAtNode(node, 'Actions should have only one payload parameter.');
            }
            var payload = node.getChildAt(2).getChildAt(2);
            if (payload) {
                if (payload.getChildAt(0).getText() !== 'payload') {
                    this.addFailureAtNode(node, 'Actions should have only one payload parameter.');
                }
                else if (!payload
                    .getChildAt(2)
                    .getText()
                    .startsWith('{')) {
                    this.addFailureAtNode(payload, 'The payload of actions should be a complex type with named content.');
                }
            }
        }
    };
    NgrxUseComplexTypeWithActionPayloadWalker.prototype.visitConstructorDeclaration = function (node) {
        _super.prototype.visitConstructorDeclaration.call(this, node);
        var isActionClass = node.parent
            .getChildren()
            .map(function (c) { return c.getText() === 'implements Action'; })
            .reduce(function (a, b) { return a || b; });
        if (isActionClass) {
            var constructorParameterList = node.getChildAt(2);
            if (constructorParameterList.getChildCount() > 1) {
                this.addFailureAtNode(constructorParameterList, 'Actions should have only one payload parameter called "payload".');
            }
            else {
                var firstConstructorParameter = constructorParameterList.getChildAt(0);
                if (firstConstructorParameter.getChildAt(1).getText() !== 'payload') {
                    this.addFailureAtNode(firstConstructorParameter.getChildAt(1), 'Actions should have only one payload parameter called "payload".');
                }
                else {
                    var typeOfFirstConstructorParameter = firstConstructorParameter.getChildAt(firstConstructorParameter.getChildCount() - 1);
                    if (!typeOfFirstConstructorParameter.getText().startsWith('{') &&
                        !typeOfFirstConstructorParameter.getText().endsWith('Type')) {
                        this.addFailureAtNode(typeOfFirstConstructorParameter, 'The payload of actions should be a complex type with named content.');
                    }
                }
            }
        }
    };
    return NgrxUseComplexTypeWithActionPayloadWalker;
}(Lint.RuleWalker));
var Rule = (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rule.prototype.apply = function (sourceFile) {
        return this.applyWithWalker(new NgrxUseComplexTypeWithActionPayloadWalker(sourceFile, this.getOptions()));
    };
    return Rule;
}(Lint.Rules.AbstractRule));
exports.Rule = Rule;
