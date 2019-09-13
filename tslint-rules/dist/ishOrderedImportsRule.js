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
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
var Lint = require("tslint");
var ts = require("typescript");
function generateLineEnding(sourceFile) {
    var maybeCarriageReturn = sourceFile.getText()[sourceFile.getLineEndOfPosition(0)] === '\r' ? '\r' : '';
    return maybeCarriageReturn + '\n';
}
function getFromString(node) {
    var stringLiteral = node.getChildren().find(function (e) { return ts.isStringLiteral(e); });
    var text = stringLiteral.getText();
    return text.substring(1, text.length - 1);
}
function getSortedEntries(node, lineEnding) {
    if (node.getChildAt(1).getChildAt(0) && ts.isNamedImports(node.getChildAt(1).getChildAt(0))) {
        var namedImports = node.getChildAt(1).getChildAt(0);
        var elements = namedImports.elements.map(function (i) { return i.getText(); }).sort();
        if (node.getText().search('\n') > 0) {
            var multilineJoinedElements = elements.join("," + lineEnding + "  ");
            return node
                .getText()
                .replace(/[\n\r]/g, '')
                .replace(/\{.*\}/, "{" + lineEnding + "  " + multilineJoinedElements + "," + lineEnding + "}");
        }
        return node.getText().replace(/\{.*\}/, "{ " + elements.join(', ') + " }");
    }
    return node.getText();
}
function getOrderNumber(stm) {
    var fromStm = getFromString(stm);
    if (!fromStm.startsWith('.') && !fromStm.startsWith('ish')) {
        return 0;
    }
    else if (fromStm.startsWith('ish')) {
        return 1;
    }
    else if (fromStm.startsWith('..')) {
        return 2;
    }
    else {
        return 3;
    }
}
var Rule = (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rule.prototype.apply = function (sourceFile) {
        var lineEnding = generateLineEnding(sourceFile);
        return this.applyWithFunction(sourceFile, function (ctx) {
            var importStatements = ctx.sourceFile.statements.filter(function (stm) {
                return ts.isImportDeclaration(stm);
            });
            if (importStatements.length) {
                var firstStatementOffset = importStatements[0].pos;
                var lastStatementOffset = importStatements[importStatements.length - 1].end;
                var sorter_1 = function (left, right) {
                    var leftStm = getFromString(left);
                    var rightStm = getFromString(right);
                    return leftStm.localeCompare(rightStm);
                };
                var groups_1 = importStatements.reduce(function (acc, val) {
                    var num = getOrderNumber(val);
                    acc[num] = (acc[num] || []).concat([val]);
                    return acc;
                }, {});
                var newImports = Object.keys(groups_1)
                    .sort()
                    .filter(function (num) { return !!groups_1[num]; })
                    .map(function (num) {
                    return groups_1[num]
                        .sort(sorter_1)
                        .map(function (importStatement) { return getSortedEntries(importStatement, lineEnding); })
                        .join(lineEnding);
                })
                    .join(lineEnding + lineEnding);
                var origImports = ctx.sourceFile.getText().substring(firstStatementOffset, lastStatementOffset);
                if (origImports !== newImports) {
                    ctx.addFailureAt(firstStatementOffset, lastStatementOffset, 'Import statements are not ordered correctly.', new Lint.Replacement(firstStatementOffset, lastStatementOffset, newImports));
                }
            }
        });
    };
    Rule.metadata = {
        ruleName: 'ish-ordered-imports',
        description: 'Requires that import statements be alphabetized and grouped.',
        descriptionDetails: Lint.Utils.dedent(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n            Enforce a consistent ordering for ES6 imports:\n            - Named imports must be alphabetized (i.e. \"import {A, B, C} from \"foo\";\")\n            - Import sources must be alphabetized within groups, i.e.:\n                    import * as foo from \"a\";\n                    import * as bar from \"b\";\n            - Groups of imports are delineated by blank lines."], ["\n            Enforce a consistent ordering for ES6 imports:\n            - Named imports must be alphabetized (i.e. \"import {A, B, C} from \"foo\";\")\n            - Import sources must be alphabetized within groups, i.e.:\n                    import * as foo from \"a\";\n                    import * as bar from \"b\";\n            - Groups of imports are delineated by blank lines."]))),
        hasFix: true,
        optionsDescription: Lint.Utils.dedent(templateObject_2 || (templateObject_2 = __makeTemplateObject([""], [""]))),
        options: {
            type: 'object',
            properties: {},
            additionalProperties: false,
        },
        optionExamples: [true],
        type: 'style',
        typescriptOnly: false,
    };
    return Rule;
}(Lint.Rules.AbstractRule));
exports.Rule = Rule;
var templateObject_1, templateObject_2;
