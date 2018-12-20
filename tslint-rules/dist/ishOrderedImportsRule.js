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
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
var Lint = require("tslint");
var tsutils_1 = require("tsutils");
var ts = require("typescript");
var IMPORT_SOURCES_NOT_GROUPED = 'Import sources of different groups must be sorted by: libraries, parent directories, current directory.';
var IMPORT_SOURCES_UNORDERED = 'Import sources within a group must be alphabetized.';
var NAMED_IMPORTS_UNORDERED = 'Named imports must be alphabetized.';
var ImportType;
(function (ImportType) {
    ImportType[ImportType["LibraryImport"] = 1] = "LibraryImport";
    ImportType[ImportType["ParentDirectoryImport"] = 2] = "ParentDirectoryImport";
    ImportType[ImportType["CurrentDirectoryImport"] = 3] = "CurrentDirectoryImport";
})(ImportType || (ImportType = {}));
function parseOptions() {
    return {
        groupedImports: true,
        importSourcesOrderTransform: function (x) { return x; },
        moduleSourcePath: function (x) { return x; },
        namedImportsOrderTransform: function (x) { return x; },
    };
}
var ImportsBlock = (function () {
    function ImportsBlock() {
        this.importDeclarations = [];
    }
    ImportsBlock.prototype.addImportDeclaration = function (sourceFile, node, sourcePath) {
        var start = this.getStartOffset(node);
        var end = this.getEndOffset(sourceFile, node);
        var text = sourceFile.text.substring(start, end);
        var type = this.getImportType(sourcePath);
        if (start > node.getStart() || end === 0) {
            this.importDeclarations = [];
            return;
        }
        this.importDeclarations.push({
            node: node,
            nodeEndOffset: end,
            nodeStartOffset: start,
            sourcePath: sourcePath,
            text: text,
            type: type,
        });
    };
    ImportsBlock.prototype.getImportDeclarations = function () {
        return this.importDeclarations;
    };
    ImportsBlock.prototype.replaceNamedImports = function (fileOffset, length, replacement) {
        var importDeclaration = this.getLastImportDeclaration();
        if (importDeclaration === undefined) {
            return;
        }
        var start = fileOffset - importDeclaration.nodeStartOffset;
        if (start < 0 || start + length > importDeclaration.node.getEnd()) {
            throw new Error('Unexpected named import position');
        }
        var initialText = importDeclaration.text;
        importDeclaration.text = initialText.substring(0, start) + replacement + initialText.substring(start + length);
    };
    ImportsBlock.prototype.getLastImportSource = function () {
        if (this.importDeclarations.length === 0) {
            return;
        }
        return this.getLastImportDeclaration().sourcePath;
    };
    ImportsBlock.prototype.getReplacement = function () {
        if (this.importDeclarations.length === 0) {
            return;
        }
        var fixedText = getSortedImportDeclarationsAsText(this.importDeclarations);
        var start = this.importDeclarations[0].nodeStartOffset;
        var end = this.getLastImportDeclaration().nodeEndOffset;
        return new Lint.Replacement(start, end - start, fixedText);
    };
    ImportsBlock.prototype.getStartOffset = function (node) {
        if (this.importDeclarations.length === 0) {
            return node.getStart();
        }
        return this.getLastImportDeclaration().nodeEndOffset;
    };
    ImportsBlock.prototype.getEndOffset = function (sourceFile, node) {
        return sourceFile.text.indexOf('\n', node.end) + 1;
    };
    ImportsBlock.prototype.getLastImportDeclaration = function () {
        return this.importDeclarations[this.importDeclarations.length - 1];
    };
    ImportsBlock.prototype.getImportType = function (sourcePath) {
        if (sourcePath.startsWith('ish-')) {
            return ImportType.ParentDirectoryImport;
        }
        if (sourcePath.charAt(0) === '.') {
            if (sourcePath.charAt(1) === '.') {
                return ImportType.ParentDirectoryImport;
            }
            else {
                return ImportType.CurrentDirectoryImport;
            }
        }
        else {
            return ImportType.LibraryImport;
        }
    };
    return ImportsBlock;
}());
var Walker = (function (_super) {
    __extends(Walker, _super);
    function Walker() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.importsBlocks = [new ImportsBlock()];
        _this.nextType = ImportType.LibraryImport;
        return _this;
    }
    Object.defineProperty(Walker.prototype, "currentImportsBlock", {
        get: function () {
            return this.importsBlocks[this.importsBlocks.length - 1];
        },
        enumerable: true,
        configurable: true
    });
    Walker.prototype.walk = function (sourceFile) {
        for (var _i = 0, _a = sourceFile.statements; _i < _a.length; _i++) {
            var statement = _a[_i];
            this.checkStatement(statement);
        }
        this.endBlock();
        if (this.options.groupedImports) {
            this.checkBlocksGrouping();
        }
    };
    Walker.prototype.checkStatement = function (statement) {
        if (!(tsutils_1.isImportDeclaration(statement) || tsutils_1.isImportEqualsDeclaration(statement)) ||
            /\r?\n\r?\n/.test(this.sourceFile.text.slice(statement.getFullStart(), statement.getStart(this.sourceFile)))) {
            this.endBlock();
        }
        if (tsutils_1.isImportDeclaration(statement)) {
            this.checkImportDeclaration(statement);
        }
        else if (tsutils_1.isImportEqualsDeclaration(statement)) {
            this.checkImportEqualsDeclaration(statement);
        }
        else if (tsutils_1.isModuleDeclaration(statement)) {
            var body = moduleDeclarationBody(statement);
            if (body !== undefined) {
                for (var _i = 0, _a = body.statements; _i < _a.length; _i++) {
                    var subStatement = _a[_i];
                    this.checkStatement(subStatement);
                }
                this.endBlock();
            }
        }
    };
    Walker.prototype.checkImportDeclaration = function (node) {
        if (!tsutils_1.isStringLiteral(node.moduleSpecifier)) {
            return;
        }
        var source = this.options.importSourcesOrderTransform(removeQuotes(node.moduleSpecifier.text));
        this.checkSource(source, node);
        var importClause = node.importClause;
        if (importClause !== undefined &&
            importClause.namedBindings !== undefined &&
            tsutils_1.isNamedImports(importClause.namedBindings)) {
            this.checkNamedImports(importClause.namedBindings);
        }
    };
    Walker.prototype.checkImportEqualsDeclaration = function (node) {
        var moduleReference = node.moduleReference;
        if (!tsutils_1.isExternalModuleReference(moduleReference)) {
            return;
        }
        var expression = moduleReference.expression;
        if (expression === undefined || !tsutils_1.isStringLiteral(expression)) {
            return;
        }
        var source = this.options.importSourcesOrderTransform(removeQuotes(expression.text));
        this.checkSource(source, node);
    };
    Walker.prototype.checkSource = function (source, node) {
        var currentSource = this.options.moduleSourcePath(source);
        var previousSource = this.currentImportsBlock.getLastImportSource();
        this.currentImportsBlock.addImportDeclaration(this.sourceFile, node, currentSource);
        if (previousSource && compare(currentSource, previousSource) === -1) {
            this.lastFix = [];
            this.addFailureAtNode(node, IMPORT_SOURCES_UNORDERED, this.lastFix);
        }
    };
    Walker.prototype.endBlock = function () {
        if (this.lastFix !== undefined) {
            var replacement = this.currentImportsBlock.getReplacement();
            if (replacement !== undefined) {
                this.lastFix.push(replacement);
            }
            this.lastFix = undefined;
        }
        this.importsBlocks.push(new ImportsBlock());
    };
    Walker.prototype.checkNamedImports = function (node) {
        var _this = this;
        var imports = node.elements;
        var pair = findUnsortedPair(imports, this.options.namedImportsOrderTransform);
        if (pair !== undefined) {
            var a = pair[0], b = pair[1];
            var sortedDeclarations = sortByKey(imports, function (x) { return _this.options.namedImportsOrderTransform(x.getText()); }).map(function (x) {
                return x.getText();
            });
            for (var i = imports.length - 1; i >= 0; i--) {
                var start = imports[i].getStart();
                var length_1 = imports[i].getText().length;
                this.currentImportsBlock.replaceNamedImports(start, length_1, sortedDeclarations[i]);
            }
            this.lastFix = [];
            this.addFailure(a.getStart(), b.getEnd(), NAMED_IMPORTS_UNORDERED, this.lastFix);
        }
    };
    Walker.prototype.checkBlocksGrouping = function () {
        this.importsBlocks.some(this.checkBlockGroups, this);
    };
    Walker.prototype.checkBlockGroups = function (importsBlock) {
        var oddImportDeclaration = this.getOddImportDeclaration(importsBlock);
        if (oddImportDeclaration !== undefined) {
            this.addFailureAtNode(oddImportDeclaration.node, IMPORT_SOURCES_NOT_GROUPED, this.getReplacements());
            return true;
        }
        return false;
    };
    Walker.prototype.getOddImportDeclaration = function (importsBlock) {
        var importDeclarations = importsBlock.getImportDeclarations();
        if (importDeclarations.length === 0) {
            return;
        }
        var type = importDeclarations[0].type;
        if (type < this.nextType) {
            return importDeclarations[0];
        }
        else {
            this.nextType = type;
            return importDeclarations.find(function (importDeclaration) { return importDeclaration.type !== type; });
        }
    };
    Walker.prototype.getReplacements = function () {
        var importDeclarationsList = this.importsBlocks
            .map(function (block) { return block.getImportDeclarations(); })
            .filter(function (imports) { return imports.length > 0; });
        var allImportDeclarations = (_a = []).concat.apply(_a, importDeclarationsList);
        var replacements = this.getReplacementsForExistingImports(importDeclarationsList);
        var startOffset = allImportDeclarations.length === 0 ? 0 : allImportDeclarations[0].nodeStartOffset;
        replacements.push(Lint.Replacement.appendText(startOffset, this.getGroupedImports(allImportDeclarations)));
        return replacements;
        var _a;
    };
    Walker.prototype.getReplacementsForExistingImports = function (importDeclarationsList) {
        var _this = this;
        return importDeclarationsList.map(function (items, index) {
            var start = items[0].nodeStartOffset;
            if (index > 0) {
                var prevItems = importDeclarationsList[index - 1];
                var last = prevItems[prevItems.length - 1];
                if (/[\r\n]+/.test(_this.sourceFile.text.slice(last.nodeEndOffset, start))) {
                    start = last.nodeEndOffset;
                }
            }
            return Lint.Replacement.deleteFromTo(start, items[items.length - 1].nodeEndOffset);
        });
    };
    Walker.prototype.getGroupedImports = function (importDeclarations) {
        return [ImportType.LibraryImport, ImportType.ParentDirectoryImport, ImportType.CurrentDirectoryImport]
            .map(function (type) {
            var imports = importDeclarations.filter(function (importDeclaration) { return importDeclaration.type === type; });
            return getSortedImportDeclarationsAsText(imports);
        })
            .filter(function (text) { return text.length > 0; })
            .join(this.getEolChar());
    };
    Walker.prototype.getEolChar = function () {
        var lineEnd = this.sourceFile.getLineEndOfPosition(0);
        var newLine;
        if (lineEnd > 0) {
            if (lineEnd > 1 && this.sourceFile.text[lineEnd - 1] === '\r') {
                newLine = '\r\n';
            }
            else if (this.sourceFile.text[lineEnd] === '\n') {
                newLine = '\n';
            }
        }
        return newLine === undefined ? ts.sys.newLine : newLine;
    };
    return Walker;
}(Lint.AbstractWalker));
var Rule = (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rule.prototype.apply = function (sourceFile) {
        return this.applyWithWalker(new Walker(sourceFile, this.ruleName, parseOptions()));
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
function findUnsortedPair(xs, transform) {
    for (var i = 1; i < xs.length; i++) {
        if (transform(xs[i].getText()) < transform(xs[i - 1].getText())) {
            return [xs[i - 1], xs[i]];
        }
    }
    return;
}
function compare(a, b) {
    function isLow(value) {
        return value[0] === '.' || value[0] === '/';
    }
    if (isLow(a) && !isLow(b)) {
        return 1;
    }
    else if (!isLow(a) && isLow(b)) {
        return -1;
    }
    else if (a > b) {
        return 1;
    }
    else if (a < b) {
        return -1;
    }
    return 0;
}
function removeQuotes(value) {
    if (value.length > 1 && (value[0] === "'" || value[0] === '"')) {
        return value.substr(1, value.length - 2);
    }
    return value;
}
function getSortedImportDeclarationsAsText(importDeclarations) {
    var sortedDeclarations = sortByKey(importDeclarations.slice(), function (x) { return x.sourcePath; });
    return sortedDeclarations.map(function (x) { return x.text; }).join('');
}
function sortByKey(xs, getSortKey) {
    return xs.slice().sort(function (a, b) { return compare(getSortKey(a), getSortKey(b)); });
}
function moduleDeclarationBody(node) {
    var body = node.body;
    while (body !== undefined && body.kind === ts.SyntaxKind.ModuleDeclaration) {
        body = body.body;
    }
    return body !== undefined && body.kind === ts.SyntaxKind.ModuleBlock ? body : undefined;
}
var templateObject_1, templateObject_2;
