import { tsquery } from '@phenomnomnominal/tsquery';
import * as Lint from 'tslint';
import * as ts from 'typescript';

function isExported(node: ts.Node): boolean {
  return !!tsquery(node, 'ExportKeyword').length;
}

function getCommentsText(node: ts.Node): string {
  return node.getFullText().substr(0, node.getStart() - node.getFullStart());
}

function checkForValidOrNoJSDoc(node: ts.Node, ctx: Lint.WalkContext) {
  const comments = ts.getLeadingCommentRanges(node.getFullText(), 0);
  if (comments) {
    const isUnrelatedComments = /\n\n\ *$/.test(getCommentsText(node));

    if (!isUnrelatedComments) {
      comments.forEach(c => {
        const commentText = node.getFullText().substring(c.pos, c.end);
        if (
          !commentText.startsWith('/**') &&
          !commentText.startsWith('// tslint:disable') &&
          !commentText.startsWith('// not-dead-code')
        ) {
          ctx.addFailureAt(
            node.getFullStart() + c.pos,
            c.end - c.pos,
            'This comment should be a JSDoc comment or it should be moved further away.'
          );
        }
      });
    }
  }
}

function checkForCommentsToBeMovedAway(node: ts.Node, ctx: Lint.WalkContext) {
  const comments = ts.getLeadingCommentRanges(node.getFullText(), 0);
  if (comments) {
    comments
      .filter(c => {
        const commentText = node.getFullText().substring(c.pos, c.end);
        return !commentText.startsWith('// tslint:disable');
      })
      .forEach(c =>
        ctx.addFailureAt(
          node.getFullStart() + c.pos,
          c.end - c.pos,
          'This comment should be moved above the decorator.'
        )
      );
  }
}

function onSameLine(node1: ts.Node, node2: ts.Node, ctx: Lint.WalkContext): boolean {
  return (
    ctx.sourceFile.getLineAndCharacterOfPosition(node1.getStart()).line ===
    ctx.sourceFile.getLineAndCharacterOfPosition(node2.getStart()).line
  );
}

function checkJSDocNewLineAtEnd(node: ts.Node, ctx: Lint.WalkContext) {
  const comments = getCommentsText(node);
  if (comments) {
    const spacing = /( *)?\/\*\*/.exec(comments);
    if (spacing && !/\n *$/.test(comments)) {
      ctx.addFailureAt(
        node.getStart() - 1,
        node.getStart(),
        'No new line at end of comment.',
        Lint.Replacement.appendText(node.getStart(), '\n' + (spacing[1] ?? ''))
      );
    }
  }
}

export class Rule extends Lint.Rules.AbstractRule {
  apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    return this.applyWithFunction(sourceFile, ctx => {
      ctx.sourceFile.statements
        .filter(s => !ts.isImportDeclaration(s) && !ts.isExportDeclaration(s))
        .filter(isExported)
        .forEach(statement => {
          checkForValidOrNoJSDoc(statement, ctx);
          if (ts.isClassDeclaration(statement)) {
            if (statement.decorators) {
              tsquery(statement, 'ExportKeyword').forEach(exp => checkForCommentsToBeMovedAway(exp, ctx));
            }
            statement.members.forEach(c => {
              checkForValidOrNoJSDoc(c, ctx);
              if (c.decorators && c.decorators.some(d => !onSameLine(d, c.getChildAt(1), ctx))) {
                checkForCommentsToBeMovedAway(c.getChildAt(1), ctx);
              }
              checkJSDocNewLineAtEnd(c, ctx);
            });
          }
          checkJSDocNewLineAtEnd(statement, ctx);
        });
    });
  }
}
