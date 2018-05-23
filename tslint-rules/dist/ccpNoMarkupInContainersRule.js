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
var MESSAGE = 'Container templates should not contain markup.';
var CCPNoMarkupInContainersWalker = (function (_super) {
    __extends(CCPNoMarkupInContainersWalker, _super);
    function CCPNoMarkupInContainersWalker(sourceFile, options) {
        var _this = _super.call(this, sourceFile, options) || this;
        _this.patterns = options['ruleArguments'][0]['patterns'];
        return _this;
    }
    CCPNoMarkupInContainersWalker.prototype.visitSourceFile = function (sourceFile) {
        var _this = this;
        if (sourceFile.fileName.match(/.*\/containers\/(?!.*(routes|module|spec).ts$).*.ts/)) {
            var fileName = sourceFile.fileName;
            var templateName = fileName.substring(0, fileName.length - 2) + 'html';
            try {
                var template_1 = fs.readFileSync(templateName, 'utf8');
                this.patterns.forEach(function (pattern) {
                    if (template_1.search(pattern) >= 0) {
                        var message = MESSAGE + " (found '" + pattern + "')";
                        _this.addFailureAtNode(sourceFile, message);
                    }
                });
            }
            catch (err) {
            }
        }
    };
    return CCPNoMarkupInContainersWalker;
}(Lint.RuleWalker));
var Rule = (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rule.prototype.apply = function (sourceFile) {
        return this.applyWithWalker(new CCPNoMarkupInContainersWalker(sourceFile, this.getOptions()));
    };
    return Rule;
}(Lint.Rules.AbstractRule));
exports.Rule = Rule;
