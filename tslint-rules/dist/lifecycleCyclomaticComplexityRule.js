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
var cc = require("tslint/lib/rules/cyclomaticComplexityRule");
var tsutils_1 = require("tsutils");
var Rule = (function (_super) {
    __extends(Rule, _super);
    function Rule(options) {
        var _this = _super.call(this, options) || this;
        _this.complexity = {};
        if (options.ruleArguments.length && options.ruleArguments[0]) {
            _this.complexity = options.ruleArguments[0];
        }
        return _this;
    }
    Rule.prototype.apply = function (sourceFile) {
        var _this = this;
        if (sourceFile.fileName.search(/.(component|container|pipe|directive).ts/) < 0) {
            return [];
        }
        return this.applyWithFunction(sourceFile, function (ctx) {
            var failures = new cc.Rule({ ruleArguments: [1] }).apply(sourceFile);
            failures.forEach(function (f) {
                var methodIdentifier = tsutils_1.getTokenAtPosition(sourceFile, f.getStartPosition().getPosition());
                var methodIdentifierText = methodIdentifier.getText();
                if (methodIdentifierText.startsWith('ngOn')) {
                    var threshold = _this.complexity[methodIdentifierText] || 1;
                    var match = f.getFailure().match(new RegExp('has a cyclomatic complexity of ([0-9]+) which'));
                    var actualCC = Number.parseInt(match[1], 10) || 999;
                    if (actualCC > threshold) {
                        ctx.addFailureAtNode(methodIdentifier, "The function " + methodIdentifierText + " has a cyclomatic complexity of " + actualCC + " which is higher than the threshold of " + threshold);
                    }
                }
            });
        });
    };
    return Rule;
}(Lint.Rules.AbstractRule));
exports.Rule = Rule;
