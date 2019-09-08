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
var rule = require("tslint/lib/rules/noObjectLiteralTypeAssertionRule");
var Rule = (function (_super) {
    __extends(Rule, _super);
    function Rule(options) {
        var _this = _super.call(this, options) || this;
        _this.includePattern = '.*';
        if (options.ruleArguments.length && options.ruleArguments[0]) {
            _this.includePattern = options.ruleArguments[0];
        }
        return _this;
    }
    Rule.prototype.apply = function (sourceFile) {
        if (new RegExp(this.includePattern).test(sourceFile.fileName)) {
            return Rule.RULE.apply(sourceFile);
        }
        return [];
    };
    Rule.RULE = new rule.Rule({
        ruleArguments: [],
        ruleSeverity: 'error',
        ruleName: 'ish-no-object-literal-type-assertion',
    });
    return Rule;
}(Lint.Rules.AbstractRule));
exports.Rule = Rule;
