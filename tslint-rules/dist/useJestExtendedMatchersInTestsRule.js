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
var UseJestExtendedMatchersInTestsWalker = (function (_super) {
    __extends(UseJestExtendedMatchersInTestsWalker, _super);
    function UseJestExtendedMatchersInTestsWalker() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.replacements = [
            { pattern: /(toBe|toEqual)\(false\)$/, replacement: 'toBeFalse()', text: 'toBeFalse' },
            { pattern: /(toBe|toEqual)\(true\)$/, replacement: 'toBeTrue()', text: 'toBeTrue' },
            { pattern: /(toBe|toEqual)\(undefined\)$/, replacement: 'toBeUndefined()', text: 'toBeUndefined' },
            { pattern: /(toBe|toEqual)\(\'\'\)$/, replacement: 'toBeEmpty()', text: 'toBeEmpty' },
            { pattern: /(toBe|toEqual)\(\[\]\)$/, replacement: 'toBeEmpty()', text: 'toBeEmpty' },
            { pattern: /(toBe|toEqual)\(\{\}\)$/, replacement: 'toBeEmpty()', text: 'toBeEmpty' },
            { pattern: /\.length\)\.(toBe|toEqual)\(([0-9]+)\)$/, replacement: ').toHaveLength($2)', text: 'toHaveLength' },
        ];
        return _this;
    }
    UseJestExtendedMatchersInTestsWalker.prototype.visitSourceFile = function (sourceFile) {
        if (sourceFile.fileName.endsWith('.spec.ts')) {
            _super.prototype.visitSourceFile.call(this, sourceFile);
        }
    };
    UseJestExtendedMatchersInTestsWalker.prototype.visitIdentifier = function (node) {
        if (node.escapedText === 'toBe' || node.escapedText === 'toEqual') {
            var expectStatement = node.parent.parent;
            var text = expectStatement.getText();
            for (var index = 0; index < this.replacements.length; index++) {
                var rep = this.replacements[index];
                if (text.search(rep.pattern) > 0) {
                    var fix = new Lint.Replacement(expectStatement.getStart(), expectStatement.getWidth(), text.replace(rep.pattern, rep.replacement));
                    this.addFailureAtNode(expectStatement, "use " + rep.text, fix);
                    break;
                }
            }
        }
    };
    return UseJestExtendedMatchersInTestsWalker;
}(Lint.RuleWalker));
var Rule = (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rule.prototype.apply = function (sourceFile) {
        return this.applyWithWalker(new UseJestExtendedMatchersInTestsWalker(sourceFile, this.getOptions()));
    };
    return Rule;
}(Lint.Rules.AbstractRule));
exports.Rule = Rule;
