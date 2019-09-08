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
        if (!sourceFile.fileName.endsWith('.spec.ts')) {
            return [];
        }
        return this.applyWithFunction(sourceFile, function (ctx) {
            tsquery_1.tsquery(ctx.sourceFile, 'Identifier[name=/(toBe|toEqual)/]').forEach(function (node) {
                var expectStatement = node.parent.parent;
                var text = expectStatement.getText();
                for (var index = 0; index < Rule.REPLACEMENTS.length; index++) {
                    var rep = Rule.REPLACEMENTS[index];
                    if (text.search(rep.pattern) > 0) {
                        var fix = new Lint.Replacement(expectStatement.getStart(), expectStatement.getWidth(), text.replace(rep.pattern, rep.replacement));
                        ctx.addFailureAtNode(expectStatement, "use " + rep.text, fix);
                        break;
                    }
                }
            });
        });
    };
    Rule.REPLACEMENTS = [
        { pattern: /(toBe|toEqual)\(false\)$/, replacement: 'toBeFalse()', text: 'toBeFalse' },
        { pattern: /(toBe|toEqual)\(true\)$/, replacement: 'toBeTrue()', text: 'toBeTrue' },
        { pattern: /(toBe|toEqual)\(undefined\)$/, replacement: 'toBeUndefined()', text: 'toBeUndefined' },
        { pattern: /(toBe|toEqual)\(\'\'\)$/, replacement: 'toBeEmpty()', text: 'toBeEmpty' },
        { pattern: /(toBe|toEqual)\(\[\]\)$/, replacement: 'toBeEmpty()', text: 'toBeEmpty' },
        { pattern: /(toBe|toEqual)\(\{\}\)$/, replacement: 'toBeEmpty()', text: 'toBeEmpty' },
        { pattern: /\.length\)\.(toBe|toEqual)\(([0-9]+)\)$/, replacement: ').toHaveLength($2)', text: 'toHaveLength' },
        { pattern: /(toBe|toEqual)\(NaN\)$/, replacement: 'toBeNaN()', text: 'toBeNaN' },
    ];
    return Rule;
}(Lint.Rules.AbstractRule));
exports.Rule = Rule;
