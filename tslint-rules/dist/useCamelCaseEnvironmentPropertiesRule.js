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
        if (!sourceFile.fileName.match(/.*\/environment[\.\w]*\.ts/)) {
            return [];
        }
        return this.applyWithFunction(sourceFile, function (ctx) {
            tsquery_1.tsquery(sourceFile, 'PropertyAssignment').forEach(function (token) {
                var identifier = token.name.getText();
                if (!identifier.match(/^[a-z][A-Za-z0-9]*$/)) {
                    ctx.addFailureAtNode(token, "Property " + token.getText() + " is not camelCase formatted.");
                }
            });
        });
    };
    return Rule;
}(Lint.Rules.AbstractRule));
exports.Rule = Rule;
