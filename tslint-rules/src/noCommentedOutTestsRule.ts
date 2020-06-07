import * as Lint from 'tslint';
import { forEachComment } from 'tsutils';
import * as ts from 'typescript';

const SINGLE_LINE_COMMENT_REGEX = /\/\/.*(?=(it|describe|xit|xdescribe|fit|fdescribe)\()/;

const MULTI_LINE_COMMENT_REGEX = /\/\*[^(\*\/)]*(?=(it|describe|xit|xdescribe|fit|fdescribe)\()/;

export class Rule extends Lint.Rules.AbstractRule {
  apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    if (!sourceFile.fileName.endsWith('.spec.ts')) {
      return [];
    }
    return this.applyWithFunction(sourceFile, ctx => {
      forEachComment(sourceFile, (fullFileText, commentRange) => {
        const comment = fullFileText.substring(commentRange.pos, commentRange.end);
        if (SINGLE_LINE_COMMENT_REGEX.test(comment) || MULTI_LINE_COMMENT_REGEX.test(comment)) {
          ctx.addFailureAt(
            commentRange.pos,
            commentRange.end - commentRange.pos,
            'Comment contains commented out test cases. Use xdescribe or xit to exclude tests.'
          );
        }
      });
    });
  }
}
