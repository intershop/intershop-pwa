import { tsquery } from '@phenomnomnominal/tsquery';
import * as Lint from 'tslint';
import * as ts from 'typescript';

export class Rule extends Lint.Rules.AbstractRule {
  static REPLACEMENTS = [
    { pattern: /(toBe|toEqual)\(false\)$/, replacement: 'toBeFalse()', text: 'toBeFalse' },
    { pattern: /(toBe|toEqual)\(true\)$/, replacement: 'toBeTrue()', text: 'toBeTrue' },
    { pattern: /(toBe|toEqual)\(undefined\)$/, replacement: 'toBeUndefined()', text: 'toBeUndefined' },
    { pattern: /(toBe|toEqual)\(\'\'\)$/, replacement: 'toBeEmpty()', text: 'toBeEmpty' },
    { pattern: /(toBe|toEqual)\(\[\]\)$/, replacement: 'toBeEmpty()', text: 'toBeEmpty' },
    { pattern: /(toBe|toEqual)\(\{\}\)$/, replacement: 'toBeEmpty()', text: 'toBeEmpty' },
    { pattern: /\.length\)\.(toBe|toEqual)\(([0-9]+)\)$/, replacement: ').toHaveLength($2)', text: 'toHaveLength' },
    { pattern: /(toBe|toEqual)\(NaN\)$/, replacement: 'toBeNaN()', text: 'toBeNaN' },
    /*{
      pattern: /\.(\w{7,})\)\.(toBe|toEqual)\((.*)\)$/,
      replacement: `).toHaveProperty('$1', $3)`,
      text: 'toHaveProperty',
    },*/
  ];

  apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    if (!sourceFile.fileName.endsWith('.spec.ts')) {
      return [];
    }

    return this.applyWithFunction(sourceFile, ctx => {
      tsquery(ctx.sourceFile, 'Identifier[name=/(toBe|toEqual)/]').forEach(node => {
        const expectStatement = node.parent.parent as ts.CallExpression;
        const text = expectStatement.getText();
        for (let index = 0; index < Rule.REPLACEMENTS.length; index++) {
          const rep = Rule.REPLACEMENTS[index];
          if (text.search(rep.pattern) > 0) {
            const fix = new Lint.Replacement(
              expectStatement.getStart(),
              expectStatement.getWidth(),
              text.replace(rep.pattern, rep.replacement)
            );
            ctx.addFailureAtNode(expectStatement, `use ${rep.text}`, fix);
            break;
          }
        }
      });
    });
  }
}
