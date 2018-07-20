import * as Lint from 'tslint';
import * as ts from 'typescript';

interface RuleDeclaration {
  name: string;
  file: string;
}

const kebabCaseFromPascalCase = (input: string): string =>
  input.replace(/[A-Z]+/g, match => `-${match.toLowerCase()}`).replace(/^-/, '');

const camelCaseFromPascalCase = (input: string): string =>
  `${input.substring(0, 1).toLowerCase()}${input.substring(1)}`;

class ProjectStructureWalker extends Lint.RuleWalker {
  warnUnmatched = false;
  patterns: RuleDeclaration[] = [];
  ignoredFiles: string[];
  pathPatterns: string[];

  fileName: string;

  constructor(sourceFile: ts.SourceFile, options: Lint.IOptions) {
    super(sourceFile, options);
    if (options['ruleArguments'][0]) {
      this.warnUnmatched = !!options['ruleArguments'][0]['warnUnmatched'];
      this.patterns = options['ruleArguments'][0]['patterns'];
      this.ignoredFiles = options['ruleArguments'][0]['ignoredFiles'] || [];
      if (options['ruleArguments'][0]['pathPatterns']) {
        this.pathPatterns = options['ruleArguments'][0]['pathPatterns'];
      }
    }
  }

  visitSourceFile(sourceFile: ts.SourceFile) {
    this.fileName = sourceFile.fileName;

    const isIgnored = this.ignoredFiles
      .map<boolean>(ignoredPattern => new RegExp(ignoredPattern).test(this.fileName))
      .reduce((l, r) => l || r);
    if (!isIgnored) {
      const matchesPathPattern = this.pathPatterns
        .map(pattern => new RegExp(pattern).test(this.fileName))
        .reduce((l, r) => l || r);
      if (!matchesPathPattern) {
        this.addFailureAt(0, 1, `this file path does not match any defined patterns`);
      }
      super.visitSourceFile(sourceFile);
    }
  }

  private visitName(name: string, node: ts.Node) {
    const matchingPatterns = this.patterns
      .map(pattern => ({ pattern, match: new RegExp(pattern.name).exec(name) }))
      .filter(x => !!x.match);

    if (matchingPatterns.length >= 1 && matchingPatterns[0].match[1]) {
      const config = matchingPatterns[0];
      const matched = config.match[1];
      const pathPattern = config.pattern.file
        .replace(/<kebab>/g, kebabCaseFromPascalCase(matched))
        .replace(/<camel>/g, camelCaseFromPascalCase(matched));

      if (!new RegExp(pathPattern).test(this.fileName)) {
        this.addFailureAtNode(node, `${name} is not in the correct file (expected ${pathPattern})`);
      }
    } else if (matchingPatterns.length === 0 && this.warnUnmatched) {
      console.warn(`no pattern match for ${name} in file ${this.fileName}`);
    }
  }

  visitClassDeclaration(declaration: ts.ClassDeclaration) {
    const name = declaration.name.escapedText.toString();
    this.visitName(name, declaration);
  }

  visitInterfaceDeclaration(declaration: ts.InterfaceDeclaration) {
    const name = declaration.name.escapedText.toString();
    this.visitName(name, declaration);
  }

  visitFunctionDeclaration(declaration: ts.FunctionDeclaration) {
    const name = declaration.name.escapedText.toString();
    this.visitName(name, declaration);
  }

  visitVariableStatement(stmt: ts.VariableStatement) {
    if (stmt.getText().startsWith('export')) {
      super.visitVariableStatement(stmt);
    }
  }

  visitVariableDeclaration(declaration: ts.VariableDeclaration) {
    if (ts.isIdentifier(declaration.name) && (declaration.name as ts.Identifier).escapedText) {
      const name = (declaration.name as ts.Identifier).escapedText.toString();
      this.visitName(name, declaration);
    }
  }
}

/**
 * Implementation of the project-structure rule.
 */
export class Rule extends Lint.Rules.AbstractRule {
  apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    return this.applyWithWalker(new ProjectStructureWalker(sourceFile, this.getOptions()));
  }
}
