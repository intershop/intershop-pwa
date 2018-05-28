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
var kebabCaseFromPascalCase = function (input) {
    return input.replace(/[A-Z]+/g, function (match) { return "-" + match.toLowerCase(); }).replace(/^-/, '');
};
var camelCaseFromPascalCase = function (input) {
    return "" + input.substring(0, 1).toLowerCase() + input.substring(1);
};
var ProjectStructureWalker = (function (_super) {
    __extends(ProjectStructureWalker, _super);
    function ProjectStructureWalker(sourceFile, options) {
        var _this = _super.call(this, sourceFile, options) || this;
        _this.warnUnmatched = false;
        _this.patterns = [];
        if (options['ruleArguments'][0]) {
            _this.warnUnmatched = !!options['ruleArguments'][0]['warnUnmatched'];
            _this.patterns = options['ruleArguments'][0]['patterns'];
            _this.ignoredFiles = options['ruleArguments'][0]['ignoredFiles'] || [];
            if (options['ruleArguments'][0]['pathPatterns']) {
                _this.pathPatterns = options['ruleArguments'][0]['pathPatterns'];
            }
        }
        return _this;
    }
    ProjectStructureWalker.prototype.visitSourceFile = function (sourceFile) {
        var _this = this;
        this.fileName = sourceFile.fileName;
        var isIgnored = this.ignoredFiles
            .map(function (ignoredPattern) { return new RegExp(ignoredPattern).test(_this.fileName); })
            .reduce(function (l, r) { return l || r; });
        if (!isIgnored) {
            var matchesPathPattern = this.pathPatterns
                .map(function (pattern) { return new RegExp(pattern).test(_this.fileName); })
                .reduce(function (l, r) { return l || r; });
            if (!matchesPathPattern) {
                this.addFailureAt(0, 1, "this file path does not match any defined patterns");
            }
            _super.prototype.visitSourceFile.call(this, sourceFile);
        }
    };
    ProjectStructureWalker.prototype.visitName = function (name, node) {
        var matchingPatterns = this.patterns
            .map(function (pattern) { return ({ pattern: pattern, match: new RegExp(pattern.name).exec(name) }); })
            .filter(function (x) { return !!x.match; });
        if (matchingPatterns.length >= 1 && matchingPatterns[0].match[1]) {
            var config = matchingPatterns[0];
            var matched = config.match[1];
            var pathPattern = config.pattern.file
                .replace(/<kebab>/g, kebabCaseFromPascalCase(matched))
                .replace(/<camel>/g, camelCaseFromPascalCase(matched));
            if (!new RegExp(pathPattern).test(this.fileName)) {
                this.addFailureAtNode(node, name + " is not in the correct file (expected " + pathPattern + ")");
            }
        }
        else if (matchingPatterns.length === 0 && this.warnUnmatched) {
            console.warn("no pattern match for " + name + " in file " + this.fileName);
        }
    };
    ProjectStructureWalker.prototype.visitClassDeclaration = function (declaration) {
        var name = declaration.name.escapedText.toString();
        this.visitName(name, declaration);
    };
    ProjectStructureWalker.prototype.visitInterfaceDeclaration = function (declaration) {
        var name = declaration.name.escapedText.toString();
        this.visitName(name, declaration);
    };
    ProjectStructureWalker.prototype.visitFunctionDeclaration = function (declaration) {
        var name = declaration.name.escapedText.toString();
        this.visitName(name, declaration);
    };
    ProjectStructureWalker.prototype.visitVariableStatement = function (stmt) {
        if (stmt.getText().startsWith('export')) {
            _super.prototype.visitVariableStatement.call(this, stmt);
        }
    };
    ProjectStructureWalker.prototype.visitVariableDeclaration = function (declaration) {
        if (ts.isIdentifier(declaration.name) && declaration.name.escapedText) {
            var name_1 = declaration.name.escapedText.toString();
            this.visitName(name_1, declaration);
        }
    };
    return ProjectStructureWalker;
}(Lint.RuleWalker));
var Rule = (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rule.prototype.apply = function (sourceFile) {
        return this.applyWithWalker(new ProjectStructureWalker(sourceFile, this.getOptions()));
    };
    return Rule;
}(Lint.Rules.AbstractRule));
exports.Rule = Rule;
