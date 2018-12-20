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
var ngWalker_1 = require("codelyzer/angular/ngWalker");
var Lint = require("tslint");
var ts = require("typescript");
var InitializeObservablesInDeclarationWalker = (function (_super) {
    __extends(InitializeObservablesInDeclarationWalker, _super);
    function InitializeObservablesInDeclarationWalker(sourceFile, options) {
        var _this = _super.call(this, sourceFile, options) || this;
        _this.inputs = [];
        _this.observables = [];
        _this.assignements = [];
        _this.declAssignements = [];
        if (options.ruleArguments && options.ruleArguments[0] && options.ruleArguments[0]['only-simple']) {
            _this.onlySimple = options.ruleArguments[0]['only-simple'];
        }
        return _this;
    }
    InitializeObservablesInDeclarationWalker.prototype.visitSourceFile = function (node) {
        _super.prototype.visitSourceFile.call(this, node);
        this.compute();
    };
    InitializeObservablesInDeclarationWalker.prototype.visitPropertyDeclaration = function (prop) {
        _super.prototype.visitPropertyDeclaration.call(this, prop);
        var identifier = prop.getChildren().find(function (n) { return n.kind === ts.SyntaxKind.Identifier; });
        if (prop
            .getChildAt(0)
            .getText()
            .startsWith('@Input')) {
            this.inputs.push(identifier);
        }
        else if (prop.getChildren().find(function (n) { return n.kind === ts.SyntaxKind.TypeReference && n.getText().startsWith('Observable<'); })) {
            this.observables.push(identifier);
        }
        else {
            var declAssignement = prop.getChildren().find(function (n) { return n.kind === ts.SyntaxKind.CallExpression; });
            if (declAssignement) {
                this.declAssignements.push(declAssignement);
            }
        }
    };
    InitializeObservablesInDeclarationWalker.prototype.visitExpressionStatement = function (node) {
        _super.prototype.visitExpressionStatement.call(this, node);
        var assignement = node.getChildren().find(function (n) { return n.kind === ts.SyntaxKind.BinaryExpression; });
        if (assignement && assignement.getChildAt(0).kind === ts.SyntaxKind.PropertyAccessExpression) {
            this.assignements.push(assignement);
        }
    };
    InitializeObservablesInDeclarationWalker.prototype.compute = function () {
        var _this = this;
        this.assignements
            .filter(function (assignment) {
            var leftSide = assignment.getChildAt(0).getText();
            return _this.observables.find(function (obs) { return leftSide.endsWith(obs.getText()); });
        })
            .filter(function (assignement) {
            var rightSide = assignement.getChildAt(2).getText();
            return !_this.inputs.find(function (inp) { return new RegExp("this." + inp.getText() + "[^w]").test(rightSide); });
        })
            .filter(function (assignement) {
            var node = assignement;
            while (node) {
                if (node.kind === ts.SyntaxKind.Constructor) {
                    return true;
                }
                else if (node.kind === ts.SyntaxKind.MethodDeclaration && node.getText().startsWith('ngOnInit')) {
                    return true;
                }
                node = node.parent;
            }
            return false;
        })
            .filter(function (assignement) {
            var rightSide = assignement.getChildAt(2).getText();
            return !_this.onlySimple || rightSide.search(',') < 0;
        })
            .forEach(function (assignment) {
            var name = assignment
                .getChildAt(0)
                .getText()
                .substring(5);
            _this.addFailureAtNode(assignment, (_this.onlySimple ? 'Simple' : '') + " Observable initialization of '" + name + "' can be made in declaration.");
        });
        this.declAssignements
            .filter(function (assignement) {
            return _this.inputs.find(function (inp) { return new RegExp("this." + inp.getText() + "[^w]").test(assignement.getText()); });
        })
            .forEach(function (assignement) {
            return _this.addFailureAtNode(assignement, 'Initialization depends on Input decorated property and can therefor not be made in declaration. Use ngOnInit instead.');
        });
    };
    return InitializeObservablesInDeclarationWalker;
}(ngWalker_1.NgWalker));
var Rule = (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rule.prototype.apply = function (sourceFile) {
        return this.applyWithWalker(new InitializeObservablesInDeclarationWalker(sourceFile, this.getOptions()));
    };
    return Rule;
}(Lint.Rules.AbstractRule));
exports.Rule = Rule;
