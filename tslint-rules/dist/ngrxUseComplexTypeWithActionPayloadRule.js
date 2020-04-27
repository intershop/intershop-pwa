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
var Rule = (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rule.prototype.apply = function (sourceFile) {
        if (!sourceFile.fileName.endsWith('actions.ts')) {
            return [];
        }
        return this.applyWithFunction(sourceFile, function (ctx) {
            tsquery_1.tsquery(ctx.sourceFile, 'CallExpression').forEach(function (node) {
                if (node.getChildAt(0).getText() === 'action') {
                    if (node.getChildAt(2).getChildCount() > 3) {
                        ctx.addFailureAtNode(node, 'Actions should have only one payload parameter.');
                    }
                    var payload = node.getChildAt(2).getChildAt(2);
                    if (payload) {
                        if (payload.getChildAt(0).getText() !== 'payload') {
                            ctx.addFailureAtNode(node, 'Actions should have only one payload parameter.');
                        }
                        else if (!payload
                            .getChildAt(2)
                            .getText()
                            .startsWith('{')) {
                            ctx.addFailureAtNode(payload, 'The payload of actions should be a complex type with named content.');
                        }
                    }
                }
            });
            tsquery_1.tsquery(ctx.sourceFile, '*')
                .filter(ts.isConstructorDeclaration)
                .forEach(function (node) {
                var isActionClass = node.parent
                    .getChildren()
                    .map(function (c) { return c.getText() === 'implements Action'; })
                    .reduce(function (a, b) { return a || b; });
                if (isActionClass) {
                    var constructorParameterList = node.getChildAt(2);
                    if (constructorParameterList.getChildCount() > 1) {
                        ctx.addFailureAtNode(constructorParameterList, 'Actions should have only one payload parameter called "payload".');
                    }
                    else {
                        var firstConstructorParameter = constructorParameterList.getChildAt(0);
                        if (firstConstructorParameter.getChildAt(1).getText() !== 'payload') {
                            ctx.addFailureAtNode(firstConstructorParameter.getChildAt(1), 'Actions should have only one payload parameter called "payload".');
                        }
                        else {
                            var typeOfFirstConstructorParameter = firstConstructorParameter.getChildAt(firstConstructorParameter.getChildCount() - 1);
                            if (!typeOfFirstConstructorParameter.getText().startsWith('{') &&
                                !typeOfFirstConstructorParameter.getText().endsWith('Type')) {
                                ctx.addFailureAtNode(typeOfFirstConstructorParameter, 'The payload of actions should be a complex type with named content.');
                            }
                        }
                    }
                }
            });
        });
    };
    return Rule;
}(Lint.Rules.AbstractRule));
exports.Rule = Rule;
