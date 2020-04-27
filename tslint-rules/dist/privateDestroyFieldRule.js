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
var PrivateDestroyFieldWalker = (function (_super) {
    __extends(PrivateDestroyFieldWalker, _super);
    function PrivateDestroyFieldWalker() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.apply = false;
        return _this;
    }
    PrivateDestroyFieldWalker.prototype.visitClassDecorator = function (decorator) {
        var type = decorator
            .getChildAt(1)
            .getChildAt(0)
            .getText();
        this.apply = type === 'Component' || type === 'Directive' || type === 'Pipe';
    };
    PrivateDestroyFieldWalker.prototype.visitPropertyDeclaration = function (prop) {
        if (this.apply) {
            var name_1 = prop
                .getChildren()
                .filter(function (node) { return node.kind === ts.SyntaxKind.Identifier && /^destroy(\$|)$/.test(node.getText()); });
            var containsPrivateKeyword = !!prop
                .getChildAt(0)
                .getChildren()
                .filter(function (node) { return (node.kind = ts.SyntaxKind.PrivateKeyword); }).length;
            if (name_1 && name_1.length && !containsPrivateKeyword) {
                this.addFailureAtNode(prop, 'Property should be private.');
            }
        }
    };
    return PrivateDestroyFieldWalker;
}(ngWalker_1.NgWalker));
var Rule = (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rule.prototype.apply = function (sourceFile) {
        return this.applyWithWalker(new PrivateDestroyFieldWalker(sourceFile, this.getOptions()));
    };
    return Rule;
}(Lint.Rules.AbstractRule));
exports.Rule = Rule;
