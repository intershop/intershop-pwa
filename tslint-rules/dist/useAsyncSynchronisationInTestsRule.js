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
var Rule = (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rule.prototype.apply = function (sourceFile) {
        if (!sourceFile.fileName.endsWith('.spec.ts')) {
            return [];
        }
        return this.applyWithFunction(sourceFile, function (ctx) {
            tsquery_1.tsquery(ctx.sourceFile, 'ArrowFunction').forEach(function (block) {
                if (block.parent
                    .getChildAt(0)
                    .getText()
                    .endsWith('.subscribe') &&
                    block.getText().search(/\sdone\(\)/) < 0) {
                    ctx.addFailureAtNode(block, 'asynchronous operations in tests should call done callback, see https://facebook.github.io/jest/docs/en/asynchronous.html');
                }
            });
        });
    };
    return Rule;
}(Lint.Rules.AbstractRule));
exports.Rule = Rule;
