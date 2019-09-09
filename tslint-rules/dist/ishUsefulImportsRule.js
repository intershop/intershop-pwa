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
var fs = require("fs");
var Lint = require("tslint");
var ts = require("typescript");
function getAbsolutePath(base, rel) {
    if (rel.startsWith('..')) {
        var myPath = base.split('/');
        myPath.pop();
        var otherPath = rel.split('/').reverse();
        while (otherPath.length && otherPath[otherPath.length - 1] === '..') {
            otherPath.pop();
            myPath.pop();
        }
        for (var _i = 0, _a = otherPath.reverse(); _i < _a.length; _i++) {
            var el = _a[_i];
            myPath.push(el);
        }
        return myPath.join('/');
    }
}
function getRelativePath(base, abs) {
    var basePath = base.split('/');
    basePath.pop();
    var absPath = abs.split('/');
    while (basePath[0] === absPath[0]) {
        basePath.shift();
        absPath.shift();
    }
    while (basePath.length) {
        basePath.pop();
        absPath.splice(0, 0, '..');
    }
    return absPath.join('/');
}
var Rule = (function (_super) {
    __extends(Rule, _super);
    function Rule(options) {
        var _this = _super.call(this, options) || this;
        _this.shortImports = [];
        try {
            var data = fs.readFileSync('./tsconfig.json');
            var config = JSON.parse(data);
            if (config && config.compilerOptions && config.compilerOptions.paths) {
                var paths_1 = config.compilerOptions.paths;
                _this.shortImports = Object.keys(paths_1).map(function (key) { return ({
                    pattern: '.*/' + paths_1[key][0].replace(/\/\*$/, '/'),
                    replacement: key.replace(/\/\*$/, '/'),
                }); });
            }
        }
        catch (err) {
            console.warn(err);
        }
        return _this;
    }
    Rule.prototype.apply = function (sourceFile) {
        var _this = this;
        return this.applyWithFunction(sourceFile, function (ctx) {
            var importStatements = ctx.sourceFile.statements.filter(function (stm) {
                return ts.isImportDeclaration(stm);
            });
            importStatements.forEach(function (stm) {
                var stringLiteral = stm.getChildren().find(function (e) { return ts.isStringLiteral(e); });
                var text = stringLiteral.getText();
                var fromString = text.substring(1, text.length - 1);
                var failureFound = false;
                var absPath = getAbsolutePath(ctx.sourceFile.fileName, fromString);
                _this.shortImports.forEach(function (_a) {
                    var pattern = _a.pattern, replacement = _a.replacement;
                    if (new RegExp(pattern).test(absPath)) {
                        ctx.addFailureAtNode(stringLiteral, 'Import path should rely on ish-core.', new Lint.Replacement(stringLiteral.getStart(), stringLiteral.getEnd() - stringLiteral.getStart(), "'" + absPath.replace(new RegExp(pattern), replacement) + "'"));
                        failureFound = true;
                    }
                });
                if (!failureFound && absPath) {
                    var newRel = getRelativePath(ctx.sourceFile.fileName, absPath);
                    if (newRel !== fromString) {
                        ctx.addFailureAtNode(stringLiteral, "Import path can be simplified to '" + newRel + "'.", new Lint.Replacement(stringLiteral.getStart(), stringLiteral.getEnd() - stringLiteral.getStart(), "'" + newRel + "'"));
                    }
                }
            });
        });
    };
    return Rule;
}(Lint.Rules.AbstractRule));
exports.Rule = Rule;
