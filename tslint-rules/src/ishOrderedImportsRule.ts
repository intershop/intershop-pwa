import * as Lint from 'tslint';
import {
  isExternalModuleReference,
  isImportDeclaration,
  isImportEqualsDeclaration,
  isModuleDeclaration,
  isNamedImports,
  isStringLiteral,
} from 'tsutils';
import * as ts from 'typescript';

const IMPORT_SOURCES_NOT_GROUPED =
  'Import sources of different groups must be sorted by: libraries, parent directories, current directory.';
const IMPORT_SOURCES_UNORDERED = 'Import sources within a group must be alphabetized.';
const NAMED_IMPORTS_UNORDERED = 'Named imports must be alphabetized.';

enum ImportType {
  LibraryImport = 1,
  ParentDirectoryImport = 2, // starts with "../"
  CurrentDirectoryImport = 3, // starts with "./"
}

type Transform = (x: string) => string;
interface Options {
  groupedImports: boolean;
  importSourcesOrderTransform: Transform;
  moduleSourcePath: Transform;
  namedImportsOrderTransform: Transform;
}

function parseOptions(/*ruleArguments: any[]*/): Options {
  return {
    groupedImports: true,
    importSourcesOrderTransform: x => x,
    moduleSourcePath: x => x,
    namedImportsOrderTransform: x => x,
  };
}

class ImportsBlock {
  private importDeclarations: ImportDeclaration[] = [];

  addImportDeclaration(sourceFile: ts.SourceFile, node: ImportDeclaration['node'], sourcePath: string) {
    const start = this.getStartOffset(node);
    const end = this.getEndOffset(sourceFile, node);
    const text = sourceFile.text.substring(start, end);
    const type = this.getImportType(sourcePath);

    if (start > node.getStart() || end === 0) {
      // skip block if any statements don't end with a newline to simplify implementation
      this.importDeclarations = [];
      return;
    }

    this.importDeclarations.push({
      node,
      nodeEndOffset: end,
      nodeStartOffset: start,
      sourcePath,
      text,
      type,
    });
  }

  getImportDeclarations(): ImportDeclaration[] {
    return this.importDeclarations;
  }

  // replaces the named imports on the most recent import declaration
  replaceNamedImports(fileOffset: number, length: number, replacement: string) {
    const importDeclaration = this.getLastImportDeclaration();
    if (importDeclaration === undefined) {
      // nothing to replace. This can happen if the block is skipped
      return;
    }

    const start = fileOffset - importDeclaration.nodeStartOffset;
    if (start < 0 || start + length > importDeclaration.node.getEnd()) {
      throw new Error('Unexpected named import position');
    }

    const initialText = importDeclaration.text;
    importDeclaration.text = initialText.substring(0, start) + replacement + initialText.substring(start + length);
  }

  getLastImportSource() {
    if (this.importDeclarations.length === 0) {
      return;
    }
    return this.getLastImportDeclaration().sourcePath;
  }

  // creates a Lint.Replacement object with ordering fixes for the entire block
  getReplacement() {
    if (this.importDeclarations.length === 0) {
      return;
    }
    const fixedText = getSortedImportDeclarationsAsText(this.importDeclarations);
    const start = this.importDeclarations[0].nodeStartOffset;
    const end = this.getLastImportDeclaration().nodeEndOffset;
    return new Lint.Replacement(start, end - start, fixedText);
  }

  // gets the offset immediately after the end of the previous declaration to include comment above
  private getStartOffset(node: ImportDeclaration['node']) {
    if (this.importDeclarations.length === 0) {
      return node.getStart();
    }
    return this.getLastImportDeclaration().nodeEndOffset;
  }

  // gets the offset of the end of the import's line, including newline, to include comment to the right
  private getEndOffset(sourceFile: ts.SourceFile, node: ImportDeclaration['node']) {
    return sourceFile.text.indexOf('\n', node.end) + 1;
  }

  private getLastImportDeclaration(): ImportDeclaration | undefined {
    return this.importDeclarations[this.importDeclarations.length - 1];
  }

  private getImportType(sourcePath: string): ImportType {
    if (sourcePath.startsWith('ish-')) {
      return ImportType.ParentDirectoryImport;
    }
    if (sourcePath.charAt(0) === '.') {
      if (sourcePath.charAt(1) === '.') {
        return ImportType.ParentDirectoryImport;
      } else {
        return ImportType.CurrentDirectoryImport;
      }
    } else {
      return ImportType.LibraryImport;
    }
  }
}

class Walker extends Lint.AbstractWalker<Options> {
  private readonly importsBlocks = [new ImportsBlock()];
  // keep a reference to the last Fix object so when the entire block is replaced, the replacement can be added
  private lastFix: Lint.Replacement[] | undefined;
  private nextType = ImportType.LibraryImport;

  private get currentImportsBlock(): ImportsBlock {
    return this.importsBlocks[this.importsBlocks.length - 1];
  }

  walk(sourceFile: ts.SourceFile): void {
    for (const statement of sourceFile.statements) {
      this.checkStatement(statement);
    }
    this.endBlock();
    if (this.options.groupedImports) {
      this.checkBlocksGrouping();
    }
  }

  private checkStatement(statement: ts.Statement): void {
    if (
      !(isImportDeclaration(statement) || isImportEqualsDeclaration(statement)) ||
      /\r?\n\r?\n/.test(this.sourceFile.text.slice(statement.getFullStart(), statement.getStart(this.sourceFile)))
    ) {
      this.endBlock();
    }

    if (isImportDeclaration(statement)) {
      this.checkImportDeclaration(statement);
    } else if (isImportEqualsDeclaration(statement)) {
      this.checkImportEqualsDeclaration(statement);
    } else if (isModuleDeclaration(statement)) {
      const body = moduleDeclarationBody(statement);
      if (body !== undefined) {
        for (const subStatement of body.statements) {
          this.checkStatement(subStatement);
        }
        this.endBlock();
      }
    }
  }

  private checkImportDeclaration(node: ts.ImportDeclaration) {
    if (!isStringLiteral(node.moduleSpecifier)) {
      // Ignore grammar error
      return;
    }

    const source = this.options.importSourcesOrderTransform(removeQuotes(node.moduleSpecifier.text));
    this.checkSource(source, node);

    const { importClause } = node;
    if (
      importClause !== undefined &&
      importClause.namedBindings !== undefined &&
      isNamedImports(importClause.namedBindings)
    ) {
      this.checkNamedImports(importClause.namedBindings);
    }
  }

  private checkImportEqualsDeclaration(node: ts.ImportEqualsDeclaration) {
    // only allowed `import x = require('y');`

    const { moduleReference } = node;

    if (!isExternalModuleReference(moduleReference)) {
      return;
    }

    const { expression } = moduleReference;

    if (expression === undefined || !isStringLiteral(expression)) {
      return;
    }

    const source = this.options.importSourcesOrderTransform(removeQuotes(expression.text));
    this.checkSource(source, node);
  }

  private checkSource(source: string, node: ImportDeclaration['node']) {
    const currentSource = this.options.moduleSourcePath(source);
    const previousSource = this.currentImportsBlock.getLastImportSource();
    this.currentImportsBlock.addImportDeclaration(this.sourceFile, node, currentSource);

    if (!!previousSource && compare(currentSource, previousSource) === -1) {
      this.lastFix = [];
      this.addFailureAtNode(node, IMPORT_SOURCES_UNORDERED, this.lastFix);
    }
  }

  private endBlock(): void {
    if (this.lastFix !== undefined) {
      const replacement = this.currentImportsBlock.getReplacement();
      if (replacement !== undefined) {
        this.lastFix.push(replacement);
      }
      this.lastFix = undefined;
    }
    this.importsBlocks.push(new ImportsBlock());
  }

  private checkNamedImports(node: ts.NamedImports): void {
    const imports = node.elements;

    const pair = findUnsortedPair(imports, this.options.namedImportsOrderTransform);
    if (pair !== undefined) {
      const [a, b] = pair;
      const sortedDeclarations = sortByKey(imports, x => this.options.namedImportsOrderTransform(x.getText())).map(x =>
        x.getText()
      );
      // replace in reverse order to preserve earlier offsets
      for (let i = imports.length - 1; i >= 0; i--) {
        const start = imports[i].getStart();
        const length = imports[i].getText().length;

        // replace the named imports one at a time to preserve whitespace
        this.currentImportsBlock.replaceNamedImports(start, length, sortedDeclarations[i]);
      }

      this.lastFix = [];
      this.addFailure(a.getStart(), b.getEnd(), NAMED_IMPORTS_UNORDERED, this.lastFix);
    }
  }

  private checkBlocksGrouping(): void {
    this.importsBlocks.some(this.checkBlockGroups, this);
  }

  private checkBlockGroups(importsBlock: ImportsBlock): boolean {
    const oddImportDeclaration = this.getOddImportDeclaration(importsBlock);
    if (oddImportDeclaration !== undefined) {
      this.addFailureAtNode(oddImportDeclaration.node, IMPORT_SOURCES_NOT_GROUPED, this.getReplacements());
      return true;
    }
    return false;
  }

  private getOddImportDeclaration(importsBlock: ImportsBlock): ImportDeclaration | undefined {
    const importDeclarations = importsBlock.getImportDeclarations();
    if (importDeclarations.length === 0) {
      return;
    }
    const type = importDeclarations[0].type;
    if (type < this.nextType) {
      return importDeclarations[0];
    } else {
      this.nextType = type;
      return importDeclarations.find(importDeclaration => importDeclaration.type !== type);
    }
  }

  private getReplacements(): Lint.Replacement[] {
    const importDeclarationsList = this.importsBlocks
      .map(block => block.getImportDeclarations())
      .filter(imports => imports.length > 0);
    const allImportDeclarations = ([] as ImportDeclaration[]).concat(...importDeclarationsList);
    const replacements = this.getReplacementsForExistingImports(importDeclarationsList);
    const startOffset = allImportDeclarations.length === 0 ? 0 : allImportDeclarations[0].nodeStartOffset;
    replacements.push(Lint.Replacement.appendText(startOffset, this.getGroupedImports(allImportDeclarations)));
    return replacements;
  }

  private getReplacementsForExistingImports(importDeclarationsList: ImportDeclaration[][]): Lint.Replacement[] {
    return importDeclarationsList.map((items, index) => {
      let start = items[0].nodeStartOffset;
      if (index > 0) {
        const prevItems = importDeclarationsList[index - 1];
        const last = prevItems[prevItems.length - 1];
        if (/[\r\n]+/.test(this.sourceFile.text.slice(last.nodeEndOffset, start))) {
          // remove whitespace between blocks
          start = last.nodeEndOffset;
        }
      }
      return Lint.Replacement.deleteFromTo(start, items[items.length - 1].nodeEndOffset);
    });
  }

  private getGroupedImports(importDeclarations: ImportDeclaration[]): string {
    return [ImportType.LibraryImport, ImportType.ParentDirectoryImport, ImportType.CurrentDirectoryImport]
      .map(type => {
        const imports = importDeclarations.filter(importDeclaration => importDeclaration.type === type);
        return getSortedImportDeclarationsAsText(imports);
      })
      .filter(text => text.length > 0)
      .join(this.getEolChar());
  }

  private getEolChar(): string {
    const lineEnd = this.sourceFile.getLineEndOfPosition(0);
    let newLine;
    if (lineEnd > 0) {
      if (lineEnd > 1 && this.sourceFile.text[lineEnd - 1] === '\r') {
        newLine = '\r\n';
      } else if (this.sourceFile.text[lineEnd] === '\n') {
        newLine = '\n';
      }
    }
    return newLine === undefined ? ts.sys.newLine : newLine;
  }
}

interface ImportDeclaration {
  node: ts.ImportDeclaration | ts.ImportEqualsDeclaration;
  nodeEndOffset: number; // end position of node within source file
  nodeStartOffset: number; // start position of node within source file
  text: string; // initialized with original import text; modified if the named imports are reordered
  sourcePath: string;
  type: ImportType;
}

export class Rule extends Lint.Rules.AbstractRule {
  /* tslint:disable:object-literal-sort-keys */
  static metadata: Lint.IRuleMetadata = {
    ruleName: 'ish-ordered-imports',
    description: 'Requires that import statements be alphabetized and grouped.',
    descriptionDetails: Lint.Utils.dedent`
            Enforce a consistent ordering for ES6 imports:
            - Named imports must be alphabetized (i.e. "import {A, B, C} from "foo";")
            - Import sources must be alphabetized within groups, i.e.:
                    import * as foo from "a";
                    import * as bar from "b";
            - Groups of imports are delineated by blank lines.`,
    hasFix: true,
    optionsDescription: Lint.Utils.dedent``,
    options: {
      type: 'object',
      properties: {},
      additionalProperties: false,
    },
    optionExamples: [true],
    type: 'style',
    typescriptOnly: false,
  };
  /* tslint:enable:object-literal-sort-keys */

  apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    return this.applyWithWalker(new Walker(sourceFile, this.ruleName, parseOptions(/*this.ruleArguments*/)));
  }
}

// After applying a transformation, are the nodes sorted according to the text they contain?
// If not, return the pair of nodes which are out of order.
function findUnsortedPair(
  xs: ReadonlyArray<ts.Node>,
  transform: (x: string) => string
): [ts.Node, ts.Node] | undefined {
  for (let i = 1; i < xs.length; i++) {
    if (transform(xs[i].getText()) < transform(xs[i - 1].getText())) {
      return [xs[i - 1], xs[i]];
    }
  }
  return;
}

function compare(a: string, b: string): 0 | 1 | -1 {
  function isLow(value: string) {
    return value[0] === '.' || value[0] === '/';
  }
  if (isLow(a) && !isLow(b)) {
    return 1;
  } else if (!isLow(a) && isLow(b)) {
    return -1;
  } else if (a > b) {
    return 1;
  } else if (a < b) {
    return -1;
  }
  return 0;
}

function removeQuotes(value: string): string {
  // strip out quotes
  if (value.length > 1 && (value[0] === "'" || value[0] === '"')) {
    return value.substr(1, value.length - 2);
  }
  return value;
}

function getSortedImportDeclarationsAsText(importDeclarations: ImportDeclaration[]): string {
  const sortedDeclarations = sortByKey(importDeclarations.slice(), x => x.sourcePath);
  return sortedDeclarations.map(x => x.text).join('');
}

function sortByKey<T>(xs: ReadonlyArray<T>, getSortKey: (x: T) => string): T[] {
  return xs.slice().sort((a, b) => compare(getSortKey(a), getSortKey(b)));
}

function moduleDeclarationBody(node: ts.ModuleDeclaration): ts.ModuleBlock | undefined {
  let body = node.body;
  while (body !== undefined && body.kind === ts.SyntaxKind.ModuleDeclaration) {
    body = body.body;
  }
  return body !== undefined && body.kind === ts.SyntaxKind.ModuleBlock ? body : undefined;
}
