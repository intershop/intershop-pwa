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
var ngWalker_1 = require("codelyzer/angular/ngWalker");
var Lint = require("tslint");
var ts = require("typescript");
var message = 'Component should explicitely declare "changeDetection", preferrably "ChangeDetectionStrategy.OnPush"';
var UseComponentChangeDetectionWalker = (function (_super) {
    __extends(UseComponentChangeDetectionWalker, _super);
    function UseComponentChangeDetectionWalker(sourceFile, options) {
        return _super.call(this, sourceFile, options) || this;
    }
    UseComponentChangeDetectionWalker.prototype.visitClassDecorator = function (decorator) {
        if (decorator.expression.getChildAt(0).getText() === 'Component') {
            var componentProperties = decorator.expression.getChildAt(2);
            var propertyList = componentProperties
                .getChildAt(0)
                .getChildAt(1)
                .getChildren();
            var containsChangeDetection = propertyList
                .filter(function (child) { return child.kind === ts.SyntaxKind.PropertyAssignment; })
                .map(function (assignement) { return assignement.name; })
                .filter(function (identifier) { return identifier.escapedText === 'changeDetection'; }).length === 1;
            if (!containsChangeDetection) {
                _super.prototype.addFailureAtNode.call(this, decorator, message);
            }
        }
    };
    return UseComponentChangeDetectionWalker;
}(ngWalker_1.NgWalker));
var Rule = (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rule.prototype.apply = function (sourceFile) {
        return this.applyWithWalker(new UseComponentChangeDetectionWalker(sourceFile, this.getOptions()));
    };
    return Rule;
}(Lint.Rules.AbstractRule));
exports.Rule = Rule;
