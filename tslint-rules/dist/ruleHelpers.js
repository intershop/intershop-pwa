"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tsutils_1 = require("tsutils");
var ts = require("typescript");
var RuleHelpers = (function () {
    function RuleHelpers() {
    }
    RuleHelpers.dumpNode = function (node, dumpTokens) {
        if (dumpTokens === void 0) { dumpTokens = false; }
        if (node) {
            console.log('----------------------------------------');
            console.log('type: ' + node.kind);
            console.log('text: ' + node.getText());
            console.log('child count: ' + node.getChildCount());
            for (var index = 0; index < node.getChildCount(); index++) {
                var c = node.getChildAt(index);
                console.log('child #' + index + ' ' + c.kind + ': ' + c.getText());
            }
            if (dumpTokens) {
                var pointer = node.getFirstToken();
                while (pointer !== node.getLastToken()) {
                    console.log(pointer.kind + ':' + pointer.getText());
                    pointer = tsutils_1.getNextToken(pointer);
                }
                if (pointer) {
                    console.log(pointer.kind + ':' + pointer.getText());
                }
            }
        }
        else {
            console.log(node);
        }
    };
    RuleHelpers.extractVariableNameInDeclaration = function (statement) {
        return statement
            .getChildAt(1)
            .getFirstToken()
            .getText();
    };
    RuleHelpers.getNextChildTokenOfKind = function (node, kind) {
        var pointer = node.getFirstToken();
        while (pointer && pointer.kind !== kind) {
            if (pointer === node.getLastToken()) {
                return null;
            }
            pointer = tsutils_1.getNextToken(pointer);
        }
        return pointer;
    };
    RuleHelpers.getDescribeBody = function (sourceFile) {
        var statements = sourceFile.statements.filter(function (stmt) { return stmt.kind === ts.SyntaxKind.ExpressionStatement && stmt.getFirstToken().getText() === 'describe'; });
        if (statements.length && statements[0].getChildAt(0)) {
            var describeStatement = statements[0].getChildAt(0).getChildAt(2);
            var describeBody = describeStatement
                .getChildAt(2)
                .getChildAt(4)
                .getChildAt(1);
            return describeBody;
        }
        return undefined;
    };
    return RuleHelpers;
}());
exports.RuleHelpers = RuleHelpers;
