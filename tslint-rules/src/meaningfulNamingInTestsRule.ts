import { tsquery } from '@phenomnomnominal/tsquery';
import * as Lint from 'tslint';
import { getNextToken } from 'tsutils';
import { Identifier, SourceFile, StringLiteral, SyntaxKind } from 'typescript';

const DESCRIPTION_REGEX = /^('|`|")should([\s\S]* (always|when|if|until|on|for|of|to|after|with|from) [\s\S]*| be created)('|`|")$/;

const DESCRIPTION_VIEWPOINT_ERROR_REGEX = /^('|`)should (check|test)/;

export class Rule extends Lint.Rules.AbstractRule {
  static interpolatedName(filePath: string) {
    const fileName = filePath
      .split('/')
      .filter((_, idx, array) => idx === array.length - 1)[0]
      .replace('.spec.ts', '');
    return fileName
      .split(/[\.-]+/)
      .map(part => part.substring(0, 1).toUpperCase() + part.substring(1))
      .join(' ');
  }

  apply(sourceFile: SourceFile): Lint.RuleFailure[] {
    if (!sourceFile.fileName.endsWith('.spec.ts')) {
      return [];
    }
    return this.applyWithFunction(sourceFile, ctx => {
      const statements = sourceFile.statements.filter(
        stmt => stmt.kind === SyntaxKind.ExpressionStatement && stmt.getFirstToken().getText() === 'describe'
      );
      if (statements.length) {
        statements
          .filter(statement => statement.getChildAt(0))
          .forEach(statement => {
            const describeText = statement.getChildAt(0).getChildAt(2).getChildAt(0) as StringLiteral;
            const interpolated = Rule.interpolatedName(sourceFile.fileName);
            if (describeText.text !== interpolated) {
              const fix = new Lint.Replacement(describeText.getStart(), describeText.getWidth(), `'${interpolated}'`);
              ctx.addFailureAtNode(
                describeText,
                `string does not match filename, expected '${interpolated}' found '${describeText.text}'`,
                fix
              );
            }
          });
      }

      tsquery(sourceFile, 'Identifier[name="it"]').forEach((node: Identifier) => {
        const descriptionToken = getNextToken(getNextToken(node));
        if (descriptionToken) {
          let description = descriptionToken.getText();
          // tslint:disable-next-line:no-invalid-template-strings
          if (description.indexOf('${') >= 0) {
            description = descriptionToken.parent.getText();
          }
          // allow everything for jest.each
          if (description !== 'each') {
            if (DESCRIPTION_VIEWPOINT_ERROR_REGEX.test(description)) {
              ctx.addFailureAtNode(
                descriptionToken,
                `describe what the component is doing, not what the test is doing (found "${description}")`
              );
            } else if (!DESCRIPTION_REGEX.test(description)) {
              ctx.addFailureAtNode(descriptionToken, `"${description}" does not match ${DESCRIPTION_REGEX}`);
            }
          }
        } else {
          ctx.addFailureAtNode(node, 'could not find a valid description');
        }
      });
    });
  }
}
