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
var fs = require("fs");
var Lint = require("tslint");
var ts = require("typescript");
var ruleHelpers_1 = require("./ruleHelpers");
var SHOULD_BE_CREATED_NAME = 'should be created';
var Rule = (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rule.fsExistsSync = function (myDir) {
        try {
            fs.accessSync(myDir);
            return true;
        }
        catch (e) {
            return false;
        }
    };
    Rule.checkCreationTestContent = function (ctx, node) {
        var shouldBeCreatedBlock = node
            .getChildAt(0)
            .getChildAt(2)
            .getChildAt(2)
            .getChildAt(4)
            .getChildAt(1);
        if (!shouldBeCreatedBlock.getChildren().some(Rule.findComponentTruthy)) {
            ctx.addFailureAtNode(node, "'" + SHOULD_BE_CREATED_NAME + "' block does not test if component is truthy");
        }
        if (!shouldBeCreatedBlock.getChildren().some(Rule.findElementTruthy)) {
            ctx.addFailureAtNode(node, "'" + SHOULD_BE_CREATED_NAME + "' block does not test if html element is truthy");
        }
        if (!shouldBeCreatedBlock.getChildren().some(Rule.findDetectChangesNotThrow)) {
            ctx.addFailureAtNode(node, "'" + SHOULD_BE_CREATED_NAME + "' block does not test if feature.detectChanges does not throw");
        }
    };
    Rule.findComponentTruthy = function (node) {
        return node.getText().search(/.*component.*toBeTruthy.*/) >= 0;
    };
    Rule.findElementTruthy = function (node) {
        return node.getText().search(/.*lement.*toBeTruthy.*/) >= 0;
    };
    Rule.findDetectChangesNotThrow = function (node) {
        return node.getText().search(/[\s\S]*fixture[\s\S]*detectChanges[\s\S]*not\.toThrow[\s\S]*/) >= 0;
    };
    Rule.reportMissingCreationTest = function (ctx) {
        var message = "component does not have an active '" + SHOULD_BE_CREATED_NAME + "' test";
        var failuteToken = tsquery_1.tsquery(ctx.sourceFile, 'ClassDeclaration > Identifier')[0];
        ctx.addFailureAtNode(failuteToken, message);
    };
    Rule.prototype.apply = function (sourceFile) {
        return this.applyWithFunction(sourceFile, this.visitSourceFile);
    };
    Rule.prototype.visitSourceFile = function (ctx) {
        if (ctx.sourceFile.fileName.search(/.(component|container).ts/) > 0) {
            var fileName = ctx.sourceFile.fileName;
            var testName = fileName.substring(0, fileName.length - 2) + 'spec.ts';
            if (!Rule.fsExistsSync(testName)) {
                Rule.reportMissingCreationTest(ctx);
            }
        }
        else if (ctx.sourceFile.fileName.search(/.(component|container).spec.ts/) > 0) {
            var describe_1 = ruleHelpers_1.RuleHelpers.getDescribeBody(ctx.sourceFile);
            if (describe_1) {
                var creationCheck = describe_1
                    .getChildren()
                    .find(function (n) {
                    return n.kind === ts.SyntaxKind.ExpressionStatement &&
                        n.getText().startsWith("it('" + SHOULD_BE_CREATED_NAME + "', () => {");
                });
                if (!creationCheck) {
                    ctx.addFailureAt(0, 1, "component does not have a '" + SHOULD_BE_CREATED_NAME + "' test");
                }
                else {
                    Rule.checkCreationTestContent(ctx, creationCheck);
                }
            }
            else {
                Rule.reportMissingCreationTest(ctx);
            }
        }
    };
    return Rule;
}(Lint.Rules.AbstractRule));
exports.Rule = Rule;
