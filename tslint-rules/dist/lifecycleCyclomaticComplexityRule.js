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
var cc = require("tslint/lib/rules/cyclomaticComplexityRule");
var tsutils_1 = require("tsutils");
var LifecycleCyclomaticComplexityWalker = (function (_super) {
    __extends(LifecycleCyclomaticComplexityWalker, _super);
    function LifecycleCyclomaticComplexityWalker(sourceFile, options) {
        var _this = _super.call(this, sourceFile, options) || this;
        _this.complexity = {};
        if (options.ruleArguments.length && options.ruleArguments[0]) {
            _this.complexity = options.ruleArguments[0];
        }
        return _this;
    }
    LifecycleCyclomaticComplexityWalker.prototype.visitClassDecorator = function (decorator) {
        var _this = this;
        var type = decorator
            .getChildAt(1)
            .getChildAt(0)
            .getText();
        if (type === 'Component' || type === 'Directive' || type === 'Pipe') {
            var failures = new cc.Rule({ ruleArguments: [1] }).apply(decorator.getSourceFile());
            failures.forEach(function (f) {
                var methodIdentifier = tsutils_1.getTokenAtPosition(decorator.getSourceFile(), f.getStartPosition().getPosition());
                var methodIdentifierText = methodIdentifier.getText();
                if (methodIdentifierText.startsWith('ngOn')) {
                    var threshold = _this.complexity[methodIdentifierText] || 1;
                    var match = f.getFailure().match(new RegExp('has a cyclomatic complexity of ([0-9]+) which'));
                    var actualCC = Number.parseInt(match[1], 10) || 999;
                    if (actualCC > threshold) {
                        _this.addFailureAtNode(methodIdentifier, "The function " + methodIdentifierText + " has a cyclomatic complexity of " + actualCC + " which is higher than the threshold of " + threshold);
                    }
                }
            });
        }
    };
    return LifecycleCyclomaticComplexityWalker;
}(ngWalker_1.NgWalker));
var Rule = (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rule.prototype.apply = function (sourceFile) {
        return this.applyWithWalker(new LifecycleCyclomaticComplexityWalker(sourceFile, this.getOptions()));
    };
    return Rule;
}(Lint.Rules.AbstractRule));
exports.Rule = Rule;
