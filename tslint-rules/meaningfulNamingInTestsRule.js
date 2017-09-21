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
var typescript_1 = require("typescript");
var Lint = require("tslint");
var tsutils_1 = require("tsutils");
var DESCRIPTION_REGEX = /^'should(.* (when|if|until|on) .*| be created)'$/;
var MeaningfulNamingInTestsWalker = (function (_super) {
    __extends(MeaningfulNamingInTestsWalker, _super);
    function MeaningfulNamingInTestsWalker() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MeaningfulNamingInTestsWalker.prototype.visitSourceFile = function (sourceFile) {
        var _this = this;
        if (sourceFile.fileName.search('.spec.ts') > 0) {
            // console.log('####' + sourceFile.fileName);
            tsutils_1.forEachToken(sourceFile, function (node) {
                // console.log(node.kind + ': ' + node.getText());
                if (node.kind === typescript_1.SyntaxKind.Identifier && node.getText() === 'it') {
                    do {
                        node = tsutils_1.getNextToken(node);
                    } while (node.kind !== typescript_1.SyntaxKind.StringLiteral);
                    if (node) {
                        var description = node.getText();
                        if (!DESCRIPTION_REGEX.test(description)) {
                            _this.addFailureAtNode(node, '"' + description + '" does not match ' + DESCRIPTION_REGEX);
                        }
                    }
                }
            });
        }
    };
    return MeaningfulNamingInTestsWalker;
}(Lint.RuleWalker));
/**
 * Implementation of the meainingful-naming-in-tests rule.
 */
var Rule = (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rule.prototype.apply = function (sourceFile) {
        return this.applyWithWalker(new MeaningfulNamingInTestsWalker(sourceFile, this.getOptions()));
    };
    return Rule;
}(Lint.Rules.AbstractRule));
exports.Rule = Rule;
//# sourceMappingURL=meaningfulNamingInTestsRule.js.map