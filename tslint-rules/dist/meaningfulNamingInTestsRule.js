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
var tsutils_1 = require("tsutils");
var typescript_1 = require("typescript");
var DESCRIPTION_REGEX = /^('|`|")should([\s\S]* (always|when|if|until|on|for|of|to|after) [\s\S]*| be created)('|`|")$/;
var DESCRIPTION_VIEWPOINT_ERROR_REGEX = /^('|`)should (check|test)/;
var Rule = (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rule.interpolatedName = function (filePath) {
        var fileName = filePath
            .split('/')
            .filter(function (_, idx, array) { return idx === array.length - 1; })[0]
            .replace('.spec.ts', '');
        return fileName
            .split(/[\.-]+/)
            .map(function (part) { return part.substring(0, 1).toUpperCase() + part.substring(1); })
            .join(' ');
    };
    Rule.prototype.apply = function (sourceFile) {
        if (!sourceFile.fileName.endsWith('.spec.ts')) {
            return [];
        }
        return this.applyWithFunction(sourceFile, function (ctx) {
            var statements = sourceFile.statements.filter(function (stmt) { return stmt.kind === typescript_1.SyntaxKind.ExpressionStatement && stmt.getFirstToken().getText() === 'describe'; });
            if (statements.length) {
                statements
                    .filter(function (statement) { return statement.getChildAt(0); })
                    .forEach(function (statement) {
                    var describeText = statement
                        .getChildAt(0)
                        .getChildAt(2)
                        .getChildAt(0);
                    var interpolated = Rule.interpolatedName(sourceFile.fileName);
                    if (describeText.text !== interpolated) {
                        var fix = new Lint.Replacement(describeText.getStart(), describeText.getWidth(), "'" + interpolated + "'");
                        ctx.addFailureAtNode(describeText, "string does not match filename, expected '" + interpolated + "' found '" + describeText.text + "'", fix);
                    }
                });
            }
            tsquery_1.tsquery(sourceFile, 'Identifier[name="it"]').forEach(function (node) {
                var descriptionToken = tsutils_1.getNextToken(tsutils_1.getNextToken(node));
                if (descriptionToken) {
                    var description = descriptionToken.getText();
                    if (description.indexOf('${') >= 0) {
                        description = descriptionToken.parent.getText();
                    }
                    if (description !== 'each') {
                        if (DESCRIPTION_VIEWPOINT_ERROR_REGEX.test(description)) {
                            ctx.addFailureAtNode(descriptionToken, "describe what the component is doing, not what the test is doing (found \"" + description + "\")");
                        }
                        else if (!DESCRIPTION_REGEX.test(description)) {
                            ctx.addFailureAtNode(descriptionToken, "\"" + description + "\" does not match " + DESCRIPTION_REGEX);
                        }
                    }
                }
                else {
                    ctx.addFailureAtNode(node, 'could not find a valid description');
                }
            });
        });
    };
    return Rule;
}(Lint.Rules.AbstractRule));
exports.Rule = Rule;
