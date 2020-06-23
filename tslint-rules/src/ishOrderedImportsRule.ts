import { tsquery } from '@phenomnomnominal/tsquery';
import * as Lint from 'tslint';
import * as ts from 'typescript';

function generateLineEnding(sourceFile: ts.SourceFile) {
  const maybeCarriageReturn = sourceFile.getText()[sourceFile.getLineEndOfPosition(0)] === '\r' ? '\r' : '';
  return maybeCarriageReturn + '\n';
}

function getFromString(node: ts.Node): string {
  const stringLiteral = node.getChildren().find(e => ts.isStringLiteral(e)) as ts.StringLiteral;

  const text = stringLiteral.getText();
  return text.substring(1, text.length - 1);
}

function filterUnused(sourceFile: ts.SourceFile, identifier: string): boolean {
  const split = identifier.split(' ');
  const searchIdentifier = split.length > 1 ? split.pop() : identifier;

  if (tsquery(sourceFile, `Identifier[name=${searchIdentifier}]`).length > 1) {
    return true;
  }

  return (
    tsquery(sourceFile, 'PropertyDeclaration').filter(node => node.getText().startsWith(`@${searchIdentifier}(`))
      .length >= 1
  );
}

function getSortedEntries(node: ts.Node, lineEnding: string): string {
  if (node.getChildAt(1).getChildAt(0) && ts.isNamedImports(node.getChildAt(1).getChildAt(0))) {
    const namedImports = node.getChildAt(1).getChildAt(0) as ts.NamedImports;
    const elements = namedImports.elements
      .map(i => i.getText())
      .filter(id => filterUnused(node.getSourceFile(), id))
      .sort();

    if (elements.length) {
      if (node.getText().search('\n') > 0) {
        const multilineJoinedElements = elements.join(`,${lineEnding}  `);
        return node
          .getText()
          .replace(/[\n\r]/g, '')
          .replace(/\{.*\}/, `{${lineEnding}  ${multilineJoinedElements},${lineEnding}}`);
      }

      return node.getText().replace(/\{.*\}/, `{ ${elements.join(', ')} }`);
    } else {
      return;
    }
  }
  return node.getText();
}

function getOrderNumber(stm: ts.ImportDeclaration): number {
  const fromStm = getFromString(stm);
  if (!fromStm.startsWith('.') && !fromStm.startsWith('ish')) {
    return 0;
  } else if (fromStm.startsWith('ish')) {
    return 1;
  } else if (fromStm.startsWith('..')) {
    return 2;
  } else {
    return 3;
  }
}

export class Rule extends Lint.Rules.AbstractRule {
  static metadata: Lint.IRuleMetadata = {
    ruleName: 'ish-ordered-imports',
    description: 'Requires that import statements be alphabetized and grouped.',
    descriptionDetails: Lint.Utils.dedent`
            Enforce a consistent ordering for ES6 imports:
            - Named imports must be alphabetized (i.e. "import {A, B, C} from "foo";")
            - Import sources must be alphabetized within groups, i.e.:
                    import * as foo from "a";
                    import * as bar from "b";
            - Groups of imports are delineated by blank lines.`,
    hasFix: true,
    optionsDescription: Lint.Utils.dedent``,
    options: {
      type: 'object',
      properties: {},
      additionalProperties: false,
    },
    optionExamples: [true],
    type: 'style',
    typescriptOnly: false,
  };

  apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    const lineEnding = generateLineEnding(sourceFile);

    return this.applyWithFunction(sourceFile, ctx => {
      const importStatements = ctx.sourceFile.statements.filter(stm =>
        ts.isImportDeclaration(stm)
      ) as ts.ImportDeclaration[];
      if (importStatements.length) {
        const firstStatementOffset = importStatements[0].pos;
        const lastStatementOffset = importStatements[importStatements.length - 1].end;

        const sorter = (left, right) => {
          const leftStm = getFromString(left);
          const rightStm = getFromString(right);

          return leftStm.localeCompare(rightStm);
        };

        const groups = importStatements.reduce((acc, val) => {
          const num = getOrderNumber(val);
          acc[num] = [...(acc[num] || []), val];
          return acc;
        }, {});
        const newImports = Object.keys(groups)
          .sort()
          .filter(num => !!groups[num])
          .map(num =>
            groups[num]
              .sort(sorter)
              .map(importStatement => getSortedEntries(importStatement, lineEnding))
              .filter(x => !!x)
              .join(lineEnding)
          )
          .join(lineEnding + lineEnding);

        const origImports = ctx.sourceFile.getText().substring(firstStatementOffset, lastStatementOffset);

        if (origImports !== newImports) {
          ctx.addFailureAt(
            firstStatementOffset,
            lastStatementOffset,
            'Import statements are not ordered correctly.',
            new Lint.Replacement(firstStatementOffset, lastStatementOffset, newImports)
          );
        }
      }
    });
  }
}
