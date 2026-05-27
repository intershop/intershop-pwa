import * as ts from 'typescript';

/**
 * Iterates over all tokens (leaf nodes) in a TypeScript AST.
 * Replacement for tsutils.forEachToken
 */
export function forEachToken(node: ts.Node, callback: (token: ts.Node) => void): void {
  const children = node.getChildren();
  if (children.length === 0) {
    // Leaf node (token)
    callback(node);
  } else {
    children.forEach(child => forEachToken(child, callback));
  }
}

/**
 * Finds the first direct child of a node with the specified SyntaxKind.
 * Replacement for tsutils.getChildOfKind
 */
export function getChildOfKind<T extends ts.Node>(node: ts.Node, kind: ts.SyntaxKind): T | undefined {
  return node.getChildren().find(child => child.kind === kind) as T | undefined;
}

/**
 * Import kind enum for findImports
 * Replacement for tsutils.ImportKind
 */
export enum ImportKind {
  /** import ... from "..." */
  ImportDeclaration = 1,
  /** export ... from "..." */
  ExportFrom = 2,
  /** require("...") */
  Require = 4,
  /** import("...") */
  DynamicImport = 8,
  /** All import kinds */
  All = ImportDeclaration | ExportFrom | Require | DynamicImport,
  /** All static imports (ImportDeclaration | ExportFrom) */
  AllStaticImports = ImportDeclaration | ExportFrom,
  /** All requires (Require | DynamicImport) */
  AllRequires = Require | DynamicImport,
}

/**
 * Finds all import/require statements in a source file.
 * Simplified replacement for tsutils.findImports
 */
export function findImports(sourceFile: ts.SourceFile, kinds: ImportKind): ts.StringLiteral[] {
  const imports: ts.StringLiteral[] = [];

  // eslint-disable-next-line complexity
  function visit(node: ts.Node): void {
    if (
      kinds & ImportKind.ImportDeclaration &&
      ts.isImportDeclaration(node) &&
      node.moduleSpecifier &&
      ts.isStringLiteral(node.moduleSpecifier)
    ) {
      imports.push(node.moduleSpecifier);
    }

    if (
      kinds & ImportKind.ExportFrom &&
      ts.isExportDeclaration(node) &&
      node.moduleSpecifier &&
      ts.isStringLiteral(node.moduleSpecifier)
    ) {
      imports.push(node.moduleSpecifier);
    }

    if (
      kinds & ImportKind.Require &&
      ts.isCallExpression(node) &&
      ts.isIdentifier(node.expression) &&
      node.expression.text === 'require' &&
      node.arguments.length === 1 &&
      ts.isStringLiteral(node.arguments[0])
    ) {
      imports.push(node.arguments[0]);
    }

    if (
      kinds & ImportKind.DynamicImport &&
      ts.isCallExpression(node) &&
      node.expression.kind === ts.SyntaxKind.ImportKeyword &&
      node.arguments.length === 1 &&
      ts.isStringLiteral(node.arguments[0])
    ) {
      imports.push(node.arguments[0]);
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
  return imports;
}
