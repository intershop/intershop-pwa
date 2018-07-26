import * as Lint from 'tslint';
import { ImportDeclaration, SourceFile, SyntaxKind } from 'typescript';
import { RuleHelpers } from './ruleHelpers';

interface ImportPattern {
  import: string;
  from: string;
  message: string;
  filePattern: string;
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
        const importList = importStatement
          .getChildAt(1)
          .getChildAt(0)
          .getChildAt(1);

        if (pattern.import) {
          importList
            .getChildren()
            .filter(token => token.kind === SyntaxKind.ImportSpecifier)
            .filter(token => new RegExp(pattern.import).test(token.getText()))
            .forEach(token =>
              this.addFailureAtNode(
                token,
                pattern.message || `Using '${token.getText()}' from '${fromStringText}' is banned.`
              )
            );
        } else {
          this.addFailureAtNode(importStatement, pattern.message || `Importing from '${fromStringText} is banned.`);
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
