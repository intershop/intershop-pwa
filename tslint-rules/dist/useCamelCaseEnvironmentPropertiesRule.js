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
var typescript_1 = require("typescript");
var UseCamelCaseEnvironmentPropertiesWalker = (function (_super) {
    __extends(UseCamelCaseEnvironmentPropertiesWalker, _super);
    function UseCamelCaseEnvironmentPropertiesWalker() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    UseCamelCaseEnvironmentPropertiesWalker.prototype.visitSourceFile = function (sourceFile) {
        if (sourceFile.fileName.match(/.*\/environment[\.\w]*\.ts/)) {
            _super.prototype.visitSourceFile.call(this, sourceFile);
        }
    };
    UseCamelCaseEnvironmentPropertiesWalker.prototype.visitPropertyAssignment = function (propertyAssignment) {
        var _this = this;
        propertyAssignment.getChildren().forEach(function (token) {
            if (token.kind === typescript_1.SyntaxKind.Identifier) {
                var identifier = token.getText();
                if (!identifier.match(/^[a-z][A-Za-z0-9]*$/)) {
                    _super.prototype.addFailureAtNode.call(_this, token, "Property " + token.getText() + " is not camelCase formatted.");
                }
            }
        });
        _super.prototype.visitPropertyAssignment.call(this, propertyAssignment);
    };
    return UseCamelCaseEnvironmentPropertiesWalker;
}(Lint.RuleWalker));
var Rule = (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rule.prototype.apply = function (sourceFile) {
        return this.applyWithWalker(new UseCamelCaseEnvironmentPropertiesWalker(sourceFile, this.getOptions()));
    };
    return Rule;
}(Lint.Rules.AbstractRule));
exports.Rule = Rule;
