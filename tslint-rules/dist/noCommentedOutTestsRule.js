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
var tsutils_1 = require("tsutils");
var SINGLE_LINE_COMMENT_REGEX = /\/\/.*(?=(it|describe|xit|xdescribe|fit|fdescribe)\()/;
var MULTI_LINE_COMMENT_REGEX = /\/\*[^(\*\/)]*(?=(it|describe|xit|xdescribe|fit|fdescribe)\()/;
var NoCommentedOutTestsWalker = (function (_super) {
    __extends(NoCommentedOutTestsWalker, _super);
    function NoCommentedOutTestsWalker() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NoCommentedOutTestsWalker.prototype.visitSourceFile = function (sourceFile) {
        var _this = this;
        if (sourceFile.fileName.endsWith('.spec.ts')) {
            tsutils_1.forEachComment(sourceFile, function (fullFileText, commentRange) {
                var comment = fullFileText.substring(commentRange.pos, commentRange.end);
                if (SINGLE_LINE_COMMENT_REGEX.test(comment) || MULTI_LINE_COMMENT_REGEX.test(comment)) {
                    _this.addFailureFromStartToEnd(commentRange.pos, commentRange.end, 'Comment contains commented out test cases. Use xdescribe or xit to exclude tests.');
                }
            });
        }
    };
    return NoCommentedOutTestsWalker;
}(Lint.RuleWalker));
var Rule = (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rule.prototype.apply = function (sourceFile) {
        return this.applyWithWalker(new NoCommentedOutTestsWalker(sourceFile, this.getOptions()));
    };
    return Rule;
}(Lint.Rules.AbstractRule));
exports.Rule = Rule;
