import * as Lint from 'tslint';
import { ImportDeclaration, Node, SourceFile, SyntaxKind } from 'typescript';

import { RuleHelpers } from './ruleHelpers';

interface ImportPattern {
  import: string;
  starImport: boolean;
  from: string;
  message: string;
  filePattern: string;
  fix: string;
}

class BanSpecificImportsWalker extends Lint.RuleWalker {
  patterns: ImportPattern[] = [];

  constructor(sourceFile: SourceFile, options: Lint.IOptions) {
    super(sourceFile, options);

    this.patterns = options.ruleArguments as ImportPattern[];
  }

  visitImportDeclaration(importStatement: ImportDeclaration) {
    const fromStringToken = RuleHelpers.getNextChildTokenOfKind(importStatement, SyntaxKind.StringLiteral);
    const fromStringText = fromStringToken.getText().substring(1, fromStringToken.getText().length - 1);

    this.patterns.forEach(pattern => {
      if (
        new RegExp(pattern.filePattern).test(importStatement.getSourceFile().fileName) &&
        new RegExp(pattern.from).test(fromStringText)
      ) {
        const importSpecifier = importStatement.getChildAt(1).getChildAt(0);

        let importList: Node[];

        if (importSpecifier.kind === SyntaxKind.Identifier) {
          importList = [importStatement.getChildAt(1)];
        } else if (importSpecifier.kind === SyntaxKind.NamespaceImport && pattern.starImport) {
          this.addFailureAtNode(
            importStatement,
            pattern.message || `Star imports from '${fromStringText}' are banned.`
          );
          return;
        } else {
          importList = importSpecifier
            .getChildAt(1)
            .getChildren()
            .filter(token => token.kind === SyntaxKind.ImportSpecifier);
        }

        if (pattern.starImport) {
          return;
        }

        if (pattern.import) {
          importList
            .filter(token => new RegExp(pattern.import).test(token.getText()))
            .forEach(token =>
              this.addFailureAtNode(
                token,
                pattern.message || `Using '${token.getText()}' from '${fromStringText}' is banned.`
              )
            );
        } else {
          let fix;
          if (pattern.fix) {
            RuleHelpers.dumpNode(fromStringToken);
            fix = new Lint.Replacement(
              fromStringToken.getStart(),
              fromStringToken.getWidth(),
              `'${fromStringText.replace(new RegExp(pattern.from), pattern.fix)}'`
            );
          }
          this.addFailureAtNode(
            fromStringToken,
            pattern.message || `Importing from '${fromStringText} is banned.`,
            fix
          );
        }
      }
    });
  }
}

/**
 * Implementation of the ban-specific-imports rule.
 */
export class Rule extends Lint.Rules.AbstractRule {
  apply(sourceFile: SourceFile): Lint.RuleFailure[] {
    return this.applyWithWalker(new BanSpecificImportsWalker(sourceFile, this.getOptions()));
  }
}
