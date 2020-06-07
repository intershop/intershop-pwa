import * as Lint from 'tslint';
import * as tsutils from 'tsutils';
import * as ts from 'typescript';

export class Rule extends Lint.Rules.AbstractRule {
  apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    return this.applyWithFunction(sourceFile, ctx => {
      sourceFile.statements
        .filter(s => !ts.isImportDeclaration(s) && !ts.isExportDeclaration(s))
        .forEach(statement => {
          const previousToken = tsutils.getPreviousToken(statement);
          if (previousToken) {
            const previous = ctx.sourceFile.getLineAndCharacterOfPosition(previousToken.getEnd());

            const comments = ts.getLeadingCommentRanges(statement.getFullText(), 0);
            const start = comments ? comments[0].pos + statement.getFullStart() : statement.getStart();

            const current = ctx.sourceFile.getLineAndCharacterOfPosition(start);
            if (previous.line + 1 === current.line) {
              ctx.addFailureAtNode(statement, 'New line missing', Lint.Replacement.appendText(statement.pos, '\n'));
            }
          }
        });
    });
  }
}
