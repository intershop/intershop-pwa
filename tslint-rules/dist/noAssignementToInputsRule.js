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
var NoAssignementToInputsWalker = (function (_super) {
    __extends(NoAssignementToInputsWalker, _super);
    function NoAssignementToInputsWalker(sourceFile, options) {
        var _this = _super.call(this, sourceFile, options) || this;
        _this.inputs = [];
        _this.assignements = [];
        return _this;
    }
    NoAssignementToInputsWalker.prototype.visitSourceFile = function (node) {
        _super.prototype.visitSourceFile.call(this, node);
        this.compute();
    };
    NoAssignementToInputsWalker.prototype.visitPropertyDecorator = function (decorator) {
        _super.prototype.visitPropertyDecorator.call(this, decorator);
        if (decorator.expression.getChildAt(0).getText() === 'Input') {
            var identifier = decorator.parent
                .getChildren()
                .find(function (node) { return node.kind === ts.SyntaxKind.Identifier; });
            this.inputs.push(identifier);
        }
    };
    NoAssignementToInputsWalker.prototype.visitExpressionStatement = function (node) {
        _super.prototype.visitExpressionStatement.call(this, node);
        var assignement = node.getChildren().find(function (n) { return n.kind === ts.SyntaxKind.BinaryExpression; });
        if (assignement) {
            this.assignements.push(assignement);
        }
    };
    NoAssignementToInputsWalker.prototype.compute = function () {
        var _this = this;
        this.assignements
            .filter(function (assignement) {
            var leftSide = assignement.getChildAt(0).getText();
            return _this.inputs.find(function (inp) { return new RegExp("^this." + inp.getText() + "$").test(leftSide); });
        })
            .forEach(function (assignement) {
            return _this.addFailureAtNode(assignement, 'Assigning to @Input decorated properties is forbidden.');
        });
    };
    return NoAssignementToInputsWalker;
}(ngWalker_1.NgWalker));
var Rule = (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rule.prototype.apply = function (sourceFile) {
        return this.applyWithWalker(new NoAssignementToInputsWalker(sourceFile, this.getOptions()));
    };
    return Rule;
}(Lint.Rules.AbstractRule));
exports.Rule = Rule;
