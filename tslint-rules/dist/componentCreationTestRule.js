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
var fs = require("fs");
var Lint = require("tslint");
var ts = require("typescript");
var ruleHelpers_1 = require("./ruleHelpers");
var SHOULD_BE_CREATED_NAME = 'should be created';
var ComponentCreationTestWalker = (function (_super) {
    __extends(ComponentCreationTestWalker, _super);
    function ComponentCreationTestWalker(sourceFile, options) {
        var _this = _super.call(this, sourceFile, options) || this;
        _this.warnOnlyOnMissing = false;
        _this.warnOnlyOnMissing = _this.getOptions()[0] === 'warn';
        return _this;
    }
    ComponentCreationTestWalker.prototype.visitSourceFile = function (sourceFile) {
        if (sourceFile.fileName.search(/.(component|container).ts/) > 0) {
            var fileName = sourceFile.fileName;
            var testName = fileName.substring(0, fileName.length - 2) + 'spec.ts';
            if (!this.fsExistsSync(testName)) {
                this.reportMissingCreationTest(sourceFile);
            }
        }
        else if (sourceFile.fileName.search(/.(component|container).spec.ts/) > 0) {
            var describe = ruleHelpers_1.RuleHelpers.getDescribeBody(sourceFile);
            if (describe) {
                var creationCheck = describe
                    .getChildren()
                    .find(function (n) {
                    return n.kind === ts.SyntaxKind.ExpressionStatement &&
                        n.getText().startsWith("it('" + SHOULD_BE_CREATED_NAME + "', () => {");
                });
                if (!creationCheck) {
                    _super.prototype.addFailureAt.call(this, 0, 1, "component does not have a '" + SHOULD_BE_CREATED_NAME + "' test");
                }
                else {
                    this.checkCreationTestContent(creationCheck);
                }
                _super.prototype.visitSourceFile.call(this, sourceFile);
            }
            else {
                this.reportMissingCreationTest(sourceFile);
            }
        }
    };
    ComponentCreationTestWalker.prototype.fsExistsSync = function (myDir) {
        try {
            fs.accessSync(myDir);
            return true;
        }
        catch (e) {
            return false;
        }
    };
    ComponentCreationTestWalker.prototype.checkCreationTestContent = function (node) {
        var shouldBeCreatedBlock = node
            .getChildAt(0)
            .getChildAt(2)
            .getChildAt(2)
            .getChildAt(4)
            .getChildAt(1);
        var orReduce = function (l, r) { return l || r; };
        if (!shouldBeCreatedBlock
            .getChildren()
            .map(this.findComponentTruthy)
            .reduce(orReduce, false)) {
            _super.prototype.addFailureAtNode.call(this, node, "'" + SHOULD_BE_CREATED_NAME + "' block does not test if component is truthy");
        }
        if (!shouldBeCreatedBlock
            .getChildren()
            .map(this.findElementTruthy)
            .reduce(orReduce, false)) {
            _super.prototype.addFailureAtNode.call(this, node, "'" + SHOULD_BE_CREATED_NAME + "' block does not test if html element is truthy");
        }
        if (!shouldBeCreatedBlock
            .getChildren()
            .map(this.findDetectChangesNotThrow)
            .reduce(orReduce, false)) {
            _super.prototype.addFailureAtNode.call(this, node, "'" + SHOULD_BE_CREATED_NAME + "' block does not test if feature.detectChanges does not throw");
        }
    };
    ComponentCreationTestWalker.prototype.findComponentTruthy = function (node) {
        return node.getText().search(/.*component.*toBeTruthy.*/) >= 0;
    };
    ComponentCreationTestWalker.prototype.findElementTruthy = function (node) {
        return node.getText().search(/.*lement.*toBeTruthy.*/) >= 0;
    };
    ComponentCreationTestWalker.prototype.findDetectChangesNotThrow = function (node) {
        return node.getText().search(/[\s\S]*fixture[\s\S]*detectChanges[\s\S]*not\.toThrow[\s\S]*/) >= 0;
    };
    ComponentCreationTestWalker.prototype.reportMissingCreationTest = function (sourceFile) {
        var message = "component does not have an active '" + SHOULD_BE_CREATED_NAME + "' test";
        if (this.warnOnlyOnMissing) {
            console.warn(sourceFile.fileName, message);
        }
        else {
            _super.prototype.addFailureAt.call(this, 0, 1, message);
        }
    };
    return ComponentCreationTestWalker;
}(Lint.RuleWalker));
var Rule = (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rule.prototype.apply = function (sourceFile) {
        return this.applyWithWalker(new ComponentCreationTestWalker(sourceFile, this.getOptions()));
    };
    return Rule;
}(Lint.Rules.AbstractRule));
exports.Rule = Rule;
