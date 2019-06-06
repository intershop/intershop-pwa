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
var NoBarrelFilesWalker = (function (_super) {
    __extends(NoBarrelFilesWalker, _super);
    function NoBarrelFilesWalker() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NoBarrelFilesWalker.prototype.visitSourceFile = function (sourceFile) {
        if (sourceFile.fileName.search('index.ts') > 0) {
            this.addFailureAt(0, 1, 'The use of barrel files is deprecated!');
        }
    };
    return NoBarrelFilesWalker;
}(Lint.RuleWalker));
var Rule = (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rule.prototype.apply = function (sourceFile) {
        return this.applyWithWalker(new NoBarrelFilesWalker(sourceFile, this.getOptions()));
    };
    return Rule;
}(Lint.Rules.AbstractRule));
exports.Rule = Rule;
