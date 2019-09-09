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
var ngWalker_1 = require("codelyzer/angular/ngWalker");
var basicTemplateAstVisitor_1 = require("codelyzer/angular/templates/basicTemplateAstVisitor");
var Lint = require("tslint");
var MESSAGE = 'Container templates should not contain markup. ';
var ContainerTemplateVisitor = (function (_super) {
    __extends(ContainerTemplateVisitor, _super);
    function ContainerTemplateVisitor() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ContainerTemplateVisitor.prototype.visitElement = function (element, context) {
        this.validateElement(element);
        _super.prototype.visitElement.call(this, element, context);
    };
    ContainerTemplateVisitor.prototype.validateElement = function (element) {
        var _this = this;
        if (!element.name.startsWith('ish-') && !element.name.startsWith('ng-') && element.name !== 'div') {
            this.addFailureFromStartToEnd(element.sourceSpan.start.offset, element.sourceSpan.end.offset, MESSAGE + " Found '" + element.name + "'.");
        }
        var failures = element.attrs.map(function (attr) { return _this.validateAttr(attr); }).filter(function (x) { return !!x; });
        if (failures && failures.length) {
            this.addFailureFromStartToEnd(element.sourceSpan.start.offset, element.sourceSpan.end.offset, MESSAGE + " " + failures.join(' '));
        }
    };
    ContainerTemplateVisitor.prototype.validateAttr = function (attr) {
        if (attr.name === 'class' || attr.name === 'style') {
            return "Found '" + attr.name + "' with value '" + attr.value + "'.";
        }
        else {
            return;
        }
    };
    return ContainerTemplateVisitor;
}(basicTemplateAstVisitor_1.BasicTemplateAstVisitor));
var Rule = (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rule.prototype.apply = function (sourceFile) {
        if (!sourceFile.fileName.match(/.*\/containers\/.*.ts/)) {
            return [];
        }
        var walker = new ngWalker_1.NgWalker(sourceFile, this.getOptions(), { templateVisitorCtrl: ContainerTemplateVisitor });
        walker.walk(sourceFile);
        var failures = walker.getFailures();
        if (failures && failures.length) {
            var errorToken_1 = tsquery_1.tsquery(sourceFile, 'ClassDeclaration > Identifier')[0];
            return this.applyWithFunction(sourceFile, function (ctx) {
                failures.forEach(function (f) { return ctx.addFailureAtNode(errorToken_1, f.getFailure()); });
            });
        }
        return [];
    };
    return Rule;
}(Lint.Rules.AbstractRule));
exports.Rule = Rule;
