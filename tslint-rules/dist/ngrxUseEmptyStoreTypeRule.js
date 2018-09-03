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
var NgrxUseEmptyStoreTypeWalker = (function (_super) {
    __extends(NgrxUseEmptyStoreTypeWalker, _super);
    function NgrxUseEmptyStoreTypeWalker() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NgrxUseEmptyStoreTypeWalker.prototype.visitIdentifier = function (node) {
        if (node.getText() === 'Store') {
            var storeType = node.parent;
            if (storeType.kind === ts.SyntaxKind.TypeReference && storeType.getText() !== 'Store<{}>') {
                var fix = new Lint.Replacement(storeType.getStart(), storeType.getWidth(), 'Store<{}>');
                this.addFailureAtNode(storeType, 'use empty store type (Store<{}>) and use selectors to access the store.', fix);
            }
        }
    };
    return NgrxUseEmptyStoreTypeWalker;
}(Lint.RuleWalker));
var Rule = (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rule.prototype.apply = function (sourceFile) {
        return this.applyWithWalker(new NgrxUseEmptyStoreTypeWalker(sourceFile, this.getOptions()));
    };
    return Rule;
}(Lint.Rules.AbstractRule));
exports.Rule = Rule;
