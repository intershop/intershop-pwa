import * as Lint from 'tslint';
import { getNextToken } from 'tsutils';
import { Identifier, SourceFile, StringLiteral, SyntaxKind } from 'typescript';

const DESCRIPTION_REGEX = /^('|`|")should([\s\S]* (always|when|if|until|on|for|of|to|after) [\s\S]*| be created)('|`|")$/;

const DESCRIPTION_VIEWPOINT_ERROR_REGEX = /^('|`)should (check|test)/;

class MeaningfulNamingInTestsWalker extends Lint.RuleWalker {
  interpolatedName(filePath: string) {
    const fileName = filePath
      .split('/')
      .filter((_, idx, array) => idx === array.length - 1)[0]
      .replace('.spec.ts', '');
    return fileName
      .split(/[\.-]+/)
      .map(part => part.substring(0, 1).toUpperCase() + part.substring(1))
      .reduce((acc, val) => acc + ' ' + val);
  }

  visitSourceFile(sourceFile: SourceFile) {
    if (sourceFile.fileName.endsWith('.spec.ts')) {
      const statements = sourceFile.statements.filter(
        stmt => stmt.kind === SyntaxKind.ExpressionStatement && stmt.getFirstToken().getText() === 'describe'
      );
      if (statements.length && statements[0].getChildAt(0)) {
        const describeText = statements[0]
          .getChildAt(0)
          .getChildAt(2)
          .getChildAt(0) as StringLiteral;
        const interpolated = this.interpolatedName(sourceFile.fileName);
        if (describeText.text !== interpolated) {
          const fix = new Lint.Replacement(describeText.getStart(), describeText.getWidth(), `'${interpolated}'`);
          this.addFailureAtNode(
            describeText,
            `string does not match filename, expected '${interpolated}' found '${describeText.text}'`,
            fix
          );
        }
      }
      super.visitSourceFile(sourceFile);
    }
  }

  visitIdentifier(node: Identifier) {
    if (node.getText() === 'it') {
      const descriptionToken = getNextToken(getNextToken(node));
      if (!!descriptionToken) {
        let description = descriptionToken.getText();
        if (description.indexOf('${') >= 0) {
          description = descriptionToken.parent.getText();
        }
        if (DESCRIPTION_VIEWPOINT_ERROR_REGEX.test(description)) {
          this.addFailureAtNode(
            descriptionToken,
            `describe what the component is doing, not what the test is doing (found "${description}")`
          );
        } else if (!DESCRIPTION_REGEX.test(description)) {
          this.addFailureAtNode(descriptionToken, '"' + description + '" does not match ' + DESCRIPTION_REGEX);
        }
      } else {
        this.addFailureAtNode(node, 'could not find a valid description');
      }
    }
    super.visitIdentifier(node);
  }
}

/**
 * Implementation of the meainingful-naming-in-tests rule.
 */
export class Rule extends Lint.Rules.AbstractRule {
  apply(sourceFile: SourceFile): Lint.RuleFailure[] {
    return this.applyWithWalker(new MeaningfulNamingInTestsWalker(sourceFile, this.getOptions()));
  }
}
