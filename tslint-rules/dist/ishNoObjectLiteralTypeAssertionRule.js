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
var IshNoObjectLiteralTypeAssertionWalker = (function (_super) {
    __extends(IshNoObjectLiteralTypeAssertionWalker, _super);
    function IshNoObjectLiteralTypeAssertionWalker(sourceFile, options) {
        var _this = _super.call(this, sourceFile, options) || this;
        _this.includePattern = '.*';
        if (options.ruleArguments.length && options.ruleArguments[0]) {
            _this.includePattern = options.ruleArguments[0];
        }
        return _this;
    }
    IshNoObjectLiteralTypeAssertionWalker.prototype.visitSourceFile = function (sourceFile) {
        var _this = this;
        if (new RegExp(this.includePattern).test(sourceFile.fileName)) {
            var failures = IshNoObjectLiteralTypeAssertionWalker.RULE.apply(sourceFile);
            failures.forEach(function (f) { return _this.addFailure(f); });
        }
    };
    IshNoObjectLiteralTypeAssertionWalker.RULE = new rule.Rule({
        ruleArguments: [],
        ruleSeverity: 'error',
        ruleName: 'ish-no-object-literal-type-assertion',
    });
    return IshNoObjectLiteralTypeAssertionWalker;
}(Lint.RuleWalker));
var Rule = (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rule.prototype.apply = function (sourceFile) {
        return this.applyWithWalker(new IshNoObjectLiteralTypeAssertionWalker(sourceFile, this.getOptions()));
    };
    return Rule;
}(Lint.Rules.AbstractRule));
exports.Rule = Rule;
