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

export class Rule extends Lint.Rules.AbstractRule {
  private patterns: ImportPattern[] = [];

  constructor(options: Lint.IOptions) {
    super(options);

    this.patterns = options.ruleArguments as ImportPattern[];
  }

  apply(sourceFile: SourceFile): Lint.RuleFailure[] {
    return this.applyWithFunction(sourceFile, ctx => {
      sourceFile.statements
        .filter(stm => stm.kind === SyntaxKind.ImportDeclaration)
        .forEach(node => {
          this.visitImportDeclaration(ctx, node as ImportDeclaration);
        });
    });
  }

  private visitImportDeclaration(ctx: Lint.WalkContext<void>, importStatement: ImportDeclaration) {
    const fromStringToken = RuleHelpers.getNextChildTokenOfKind(importStatement, SyntaxKind.StringLiteral);
    const fromStringText = fromStringToken.getText().substring(1, fromStringToken.getText().length - 1);

    this.patterns.forEach(pattern => {
      if (
        new RegExp(pattern.filePattern).test(importStatement.getSourceFile().fileName) &&
        new RegExp(pattern.from).test(fromStringText) &&
        importStatement.getChildAt(1).getChildAt(0)
      ) {
        const importSpecifier = importStatement.getChildAt(1).getChildAt(0);

        let importList: Node[];

        if (importSpecifier.kind === SyntaxKind.Identifier) {
          importList = [importStatement.getChildAt(1)];
        } else if (importSpecifier.kind === SyntaxKind.NamespaceImport && pattern.starImport) {
          ctx.addFailureAtNode(importStatement, pattern.message || `Star imports from '${fromStringText}' are banned.`);
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
              ctx.addFailureAtNode(
                token,
                pattern.message || `Using '${token.getText()}' from '${fromStringText}' is banned.`
              )
            );
        } else {
          let fix;
          if (pattern.fix) {
            fix = new Lint.Replacement(
              fromStringToken.getStart(),
              fromStringToken.getWidth(),
              `'${fromStringText.replace(new RegExp(pattern.from), pattern.fix)}'`
            );
          }
          ctx.addFailureAtNode(fromStringToken, pattern.message || `Importing from '${fromStringText} is banned.`, fix);
        }
      }
    });
  }
}
