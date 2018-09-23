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
var ts = require("typescript");
var UseShorthandPropertyInObjectCreationWalker = (function (_super) {
    __extends(UseShorthandPropertyInObjectCreationWalker, _super);
    function UseShorthandPropertyInObjectCreationWalker() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    UseShorthandPropertyInObjectCreationWalker.prototype.visitObjectLiteralExpression = function (node) {
        var _this = this;
        node
            .getChildAt(1)
            .getChildren()
            .filter(function (cn) { return cn.kind === ts.SyntaxKind.PropertyAssignment; })
            .map(function (cn) { return cn; })
            .filter(function (pa) { return pa.name.getText() === pa.initializer.getText(); })
            .forEach(function (pa) {
            return _this.addFailureAtNode(pa, 'Use shorthand property assignement.', Lint.Replacement.replaceNode(pa, pa.name.getText()));
        });
    };
    return UseShorthandPropertyInObjectCreationWalker;
}(Lint.RuleWalker));
var Rule = (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rule.prototype.apply = function (sourceFile) {
        return this.applyWithWalker(new UseShorthandPropertyInObjectCreationWalker(sourceFile, this.getOptions()));
    };
    return Rule;
}(Lint.Rules.AbstractRule));
exports.Rule = Rule;
