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
var UseAsyncSynchronisationInTestsWalker = (function (_super) {
    __extends(UseAsyncSynchronisationInTestsWalker, _super);
    function UseAsyncSynchronisationInTestsWalker() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    UseAsyncSynchronisationInTestsWalker.prototype.visitSourceFile = function (sourceFile) {
        if (sourceFile.fileName.endsWith('.spec.ts')) {
            _super.prototype.visitSourceFile.call(this, sourceFile);
        }
    };
    UseAsyncSynchronisationInTestsWalker.prototype.visitArrowFunction = function (block) {
        if (block.parent
            .getChildAt(0)
            .getText()
            .endsWith('.subscribe')) {
            if (block.getText().search(/\sdone\(\);/) < 0) {
                this.addFailureAtNode(block, 'asynchronous operations in tests should call done callback, see https://facebook.github.io/jest/docs/en/asynchronous.html');
            }
        }
        _super.prototype.visitArrowFunction.call(this, block);
    };
    return UseAsyncSynchronisationInTestsWalker;
}(Lint.RuleWalker));
var Rule = (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rule.prototype.apply = function (sourceFile) {
        return this.applyWithWalker(new UseAsyncSynchronisationInTestsWalker(sourceFile, this.getOptions()));
    };
    return Rule;
}(Lint.Rules.AbstractRule));
exports.Rule = Rule;
