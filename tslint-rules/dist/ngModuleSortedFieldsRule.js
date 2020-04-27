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
var ngWalker_1 = require("codelyzer/angular/ngWalker");
var Lint = require("tslint");
var ts = require("typescript");
var NgModulesSortedFieldsWalker = (function (_super) {
    __extends(NgModulesSortedFieldsWalker, _super);
    function NgModulesSortedFieldsWalker(sourceFile, options) {
        var _this = _super.call(this, sourceFile, options) || this;
        _this.ignoreTokens = [];
        if (options.ruleArguments && options.ruleArguments[0] && options.ruleArguments[0]['ignore-tokens']) {
            _this.ignoreTokens = options.ruleArguments[0]['ignore-tokens'];
        }
        return _this;
    }
    NgModulesSortedFieldsWalker.prototype.visitCallExpression = function (node) {
        if (node.getChildAt(0).getText() === 'TestBed.configureTestingModule') {
            var ngModuleDeclarationList = node
                .getChildAt(2)
                .getChildAt(0)
                .getChildAt(1);
            this.visitNgModuleDeclarationList(ngModuleDeclarationList);
        }
        _super.prototype.visitCallExpression.call(this, node);
    };
    NgModulesSortedFieldsWalker.prototype.visitClassDecorator = function (decorator) {
        var _this = this;
        if (decorator
            .getChildAt(1)
            .getChildAt(0)
            .getText() !== 'NgModule') {
            return;
        }
        decorator
            .getSourceFile()
            .getChildAt(0)
            .getChildren()
            .filter(function (node) { return node.kind === ts.SyntaxKind.VariableStatement; })
            .map(function (node) { return node.getChildAt(0); })
            .filter(function (node) { return node.kind === ts.SyntaxKind.VariableDeclarationList; })
            .map(function (node) { return node.getChildAt(1).getChildAt(0); })
            .forEach(function (node) { return _this.sortList(node.getChildAt(2).getChildAt(1)); });
        var ngModuleDeclarationList = decorator
            .getChildAt(1)
            .getChildAt(2)
            .getChildAt(0)
            .getChildAt(1);
        this.visitNgModuleDeclarationList(ngModuleDeclarationList);
        _super.prototype.visitClassDecorator.call(this, decorator);
    };
    NgModulesSortedFieldsWalker.prototype.visitNgModuleDeclarationList = function (ngModuleDeclarationList) {
        var _this = this;
        ngModuleDeclarationList
            .getChildren()
            .filter(function (node) { return node.kind !== ts.SyntaxKind.CommaToken; })
            .filter(function (node) { return /^(exports|imports|declarations|entryComponents)$/.test(node.getChildAt(0).getText()); })
            .filter(function (node) { return _this.assertList(node); })
            .forEach(function (node) {
            _this.sortList(node.getChildAt(2).getChildAt(1));
        });
    };
    NgModulesSortedFieldsWalker.prototype.assertList = function (node) {
        if (node.getSourceFile().fileName.endsWith('.spec.ts')) {
            return true;
        }
        if (node.getChildCount() < 3 || node.getChildAt(2).kind !== ts.SyntaxKind.ArrayLiteralExpression) {
            this.addFailureAtNode(node, 'Right-hand side is not an array, but it should be for schematics to function properly.');
            return false;
        }
        return true;
    };
    NgModulesSortedFieldsWalker.prototype.sortList = function (list) {
        var possibleSorted = this.getSortedIfNot(list);
        if (possibleSorted) {
            this.addFailureAtNode(list, 'list is not sorted', Lint.Replacement.replaceNode(list, possibleSorted));
        }
    };
    NgModulesSortedFieldsWalker.prototype.getSortedIfNot = function (list) {
        if (!list) {
            return;
        }
        for (var _i = 0, _a = this.ignoreTokens; _i < _a.length; _i++) {
            var token = _a[_i];
            if (list.getFullText().search(token) >= 0) {
                return;
            }
        }
        var sorted = list
            .getChildren()
            .filter(function (node) { return node.kind !== ts.SyntaxKind.CommaToken; })
            .map(function (node) { return node.getFullText(); })
            .sort(function (a, b) { return (a.trim() > b.trim() ? 1 : a.trim() < b.trim() ? -1 : 0); })
            .filter(function (val, idx, arr) { return idx === arr.indexOf(val); })
            .join(',');
        if (sorted !== list.getFullText().replace(/,$/, '')) {
            return sorted.replace(/^\n\r?/, '').replace(/^\ */g, '') + (list.getFullText().endsWith(',') ? ',' : '');
        }
        return;
    };
    return NgModulesSortedFieldsWalker;
}(ngWalker_1.NgWalker));
var Rule = (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rule.prototype.apply = function (sourceFile) {
        return this.applyWithWalker(new NgModulesSortedFieldsWalker(sourceFile, this.getOptions()));
    };
    return Rule;
}(Lint.Rules.AbstractRule));
exports.Rule = Rule;
