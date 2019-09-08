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
var tsutils_1 = require("tsutils");
var SINGLE_LINE_COMMENT_REGEX = /\/\/.*(?=(it|describe|xit|xdescribe|fit|fdescribe)\()/;
var MULTI_LINE_COMMENT_REGEX = /\/\*[^(\*\/)]*(?=(it|describe|xit|xdescribe|fit|fdescribe)\()/;
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
            tsutils_1.forEachComment(sourceFile, function (fullFileText, commentRange) {
                var comment = fullFileText.substring(commentRange.pos, commentRange.end);
                if (SINGLE_LINE_COMMENT_REGEX.test(comment) || MULTI_LINE_COMMENT_REGEX.test(comment)) {
                    ctx.addFailureAt(commentRange.pos, commentRange.end - commentRange.pos, 'Comment contains commented out test cases. Use xdescribe or xit to exclude tests.');
                }
            });
        });
    };
    return Rule;
}(Lint.Rules.AbstractRule));
exports.Rule = Rule;
