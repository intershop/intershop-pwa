import * as Lint from 'tslint';
import * as ts from 'typescript';

class UseJestExtendedMatchersInTestsWalker extends Lint.RuleWalker {
  private replacements = [
    { pattern: /(toBe|toEqual)\(false\)$/, replacement: 'toBeFalse()', text: 'toBeFalse' },
    { pattern: /(toBe|toEqual)\(true\)$/, replacement: 'toBeTrue()', text: 'toBeTrue' },
    { pattern: /(toBe|toEqual)\(undefined\)$/, replacement: 'toBeUndefined()', text: 'toBeUndefined' },
    { pattern: /(toBe|toEqual)\(null\)$/, replacement: 'toBeNull()', text: 'toBeNull' },
    { pattern: /(toBe|toEqual)\(\[\]\)$/, replacement: 'toBeEmpty()', text: 'toBeEmpty' },
    { pattern: /(toBe|toEqual)\(\{\}\)$/, replacement: 'toBeEmpty()', text: 'toBeEmpty' },
    { pattern: /\.length\)\.(toBe|toEqual)\(([0-9]+)\)$/, replacement: ').toHaveLength($2)', text: 'toHaveLength' },
  ];

  visitSourceFile(sourceFile: ts.SourceFile) {
    if (sourceFile.fileName.endsWith('.spec.ts')) {
      super.visitSourceFile(sourceFile);
    }
  }

  visitIdentifier(node: ts.Identifier) {
    if (node.escapedText === 'toBe' || node.escapedText === 'toEqual') {
      const expectStatement = node.parent.parent as ts.CallExpression;
      const text = expectStatement.getText();
      for (let index = 0; index < this.replacements.length; index++) {
        const rep = this.replacements[index];
        if (text.search(rep.pattern) > 0) {
          const fix = new Lint.Replacement(
            expectStatement.getStart(),
            expectStatement.getWidth(),
            text.replace(rep.pattern, rep.replacement)
          );
          this.addFailureAtNode(expectStatement, `use ${rep.text}`, fix);
          break;
        }
      }
    }
  }
}

/**
 * Implementation of the use-jest-extended-matchers-in-tests rule.
 */
export class Rule extends Lint.Rules.AbstractRule {
  apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    return this.applyWithWalker(new UseJestExtendedMatchersInTestsWalker(sourceFile, this.getOptions()));
  }
}
