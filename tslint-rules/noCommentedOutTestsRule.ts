import * as Lint from 'tslint';
import { forEachComment } from 'tsutils';
import * as ts from 'typescript';

const SINGLE_LINE_COMMENT_REGEX = /\/\/.*(?=(it|describe|xit|xdescribe|fit|fdescribe)\()/;
const MULTI_LINE_COMMENT_REGEX = /\/\*[^(\*\/)]*(?=(it|describe|xit|xdescribe|fit|fdescribe)\()/;

class NoCommentedOutTestsWalker extends Lint.RuleWalker {
  visitSourceFile(sourceFile: ts.SourceFile) {
    if (sourceFile.fileName.search('.spec.ts') > 0) {
      forEachComment(sourceFile, (fullFileText: string, commentRange: ts.CommentRange) => {
        const comment: string = fullFileText.substring(commentRange.pos, commentRange.end);
        if (SINGLE_LINE_COMMENT_REGEX.test(comment) || MULTI_LINE_COMMENT_REGEX.test(comment)) {
          this.addFailureFromStartToEnd(
            commentRange.pos,
            commentRange.end,
            'Comment contains commented out test cases. Use xdescribe or xit to exclude tests.'
          );
        }
      });
    }
  }
}

/**
 * Implementation of the no-commented-out-tests rule.
 */
export class Rule extends Lint.Rules.AbstractRule {
  apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    return this.applyWithWalker(new NoCommentedOutTestsWalker(sourceFile, this.getOptions()));
  }
}
