import * as Lint from 'tslint';
import { getNextToken } from 'tsutils';
import { Identifier, SourceFile } from 'typescript';

const DESCRIPTION_REGEX = /^('|`|")should([\s\S]* (when|if|until|on|for|to) [\s\S]*| be created)('|`|")$/;

const DESCRIPTION_VIEWPOINT_ERROR_REGEX = /^('|`)should (check|test)/;

class MeaningfulNamingInTestsWalker extends Lint.RuleWalker {
  visitSourceFile(sourceFile: SourceFile) {
    if (sourceFile.fileName.search('.spec.ts') > 0) {
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
            node,
            `describe what the component is doing, not what the test is doing (found "${description}")`
          );
        } else if (!DESCRIPTION_REGEX.test(description)) {
          this.addFailureAtNode(node, '"' + description + '" does not match ' + DESCRIPTION_REGEX);
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
