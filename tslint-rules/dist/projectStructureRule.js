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
var ts = require("typescript");
exports.kebabCaseFromPascalCase = function (input) {
    return input
        .replace(/[A-Z]{2,}$/, function (m) { return "" + m.substr(0, 1) + m.substr(1, m.length - 1).toLowerCase(); })
        .replace(/[A-Z]{3,}/g, function (m) { return "" + m.substr(0, 1) + m.substr(1, m.length - 2).toLowerCase() + m.substr(m.length - 1, 1); })
        .replace(/[A-Z]/g, function (match) { return "-" + match.toLowerCase(); })
        .replace(/^-/, '');
};
var camelCaseFromPascalCase = function (input) {
    return "" + input.substring(0, 1).toLowerCase() + input.substring(1);
};
var Rule = (function (_super) {
    __extends(Rule, _super);
    function Rule(options) {
        var _this = _super.call(this, options) || this;
        _this.warnUnmatched = false;
        _this.patterns = [];
        if (options.ruleArguments[0]) {
            _this.warnUnmatched = !!options.ruleArguments[0].warnUnmatched;
            _this.patterns = options.ruleArguments[0].patterns;
            _this.ignoredFiles = options.ruleArguments[0].ignoredFiles || [];
            if (options.ruleArguments[0].pathPatterns) {
                _this.pathPatterns = options.ruleArguments[0].pathPatterns;
            }
        }
        return _this;
    }
    Rule.prototype.apply = function (sourceFile) {
        var _this = this;
        var isIgnored = this.ignoredFiles.some(function (ignoredPattern) { return new RegExp(ignoredPattern).test(sourceFile.fileName); });
        if (isIgnored) {
            return [];
        }
        var matchesPathPattern = this.pathPatterns.some(function (pattern) { return new RegExp(pattern).test(sourceFile.fileName); });
        if (!matchesPathPattern) {
            return [
                new Lint.RuleFailure(sourceFile, 0, 1, "this file path does not match any defined patterns", this.ruleName),
            ];
        }
        return this.applyWithFunction(sourceFile, function (ctx) {
            tsquery_1.tsquery(ctx.sourceFile, '*')
                .filter(function (node) {
                return ts.isVariableDeclaration(node) ||
                    ts.isFunctionDeclaration(node) ||
                    ts.isInterfaceDeclaration(node) ||
                    ts.isClassDeclaration(node);
            })
                .forEach(function (node) { return _this.visitDeclaration(ctx, node); });
        });
    };
    Rule.prototype.visitDeclaration = function (ctx, node) {
        var name = node.name.getText();
        var matchingPatterns = this.patterns
            .map(function (pattern) { return ({ pattern: pattern, match: new RegExp(pattern.name).exec(name) }); })
            .filter(function (x) { return !!x.match; });
        if (matchingPatterns.length >= 1 && matchingPatterns[0].match[1]) {
            var config = matchingPatterns[0];
            var matched = config.match[1];
            var pathPattern = config.pattern.file
                .replace(/<kebab>/g, exports.kebabCaseFromPascalCase(matched))
                .replace(/<camel>/g, camelCaseFromPascalCase(matched));
            if (!new RegExp(pathPattern).test(ctx.sourceFile.fileName)) {
                ctx.addFailureAtNode(node.name, "'" + name + "' is not in the correct file (expected '" + pathPattern + "')");
            }
        }
        else if (matchingPatterns.length === 0 && this.warnUnmatched) {
            console.warn("no pattern match for " + name + " in file " + this.fileName);
        }
    };
    return Rule;
}(Lint.Rules.AbstractRule));
exports.Rule = Rule;
