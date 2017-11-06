import * as Lint from 'tslint';
import { getNextToken } from 'tsutils';
import { Identifier, SourceFile } from 'typescript';

const DESCRIPTION_REGEX = /^('|`)should(.* (when|if|until|on) .*| be created)('|`)$/;

class MeaningfulNamingInTestsWalker extends Lint.RuleWalker {

  public visitSourceFile(sourceFile: SourceFile) {
    if (sourceFile.fileName.search('.spec.ts') > 0) {
      // console.log('####' + sourceFile.fileName);
      super.visitSourceFile(sourceFile);
    }
  }

  public visitIdentifier(node: Identifier) {
    if (node.getText() === 'it') {
      const descriptionToken = getNextToken(getNextToken(node));
      if (!!descriptionToken) {
        const description = descriptionToken.getText();
        if (!DESCRIPTION_REGEX.test(description)) {
          this.addFailureAtNode(node, '"' + description + '" does not match ' + DESCRIPTION_REGEX);
        }
      }
    }
    super.visitIdentifier(node);
  }
}

/**
 * Implementation of the meainingful-naming-in-tests rule.
 */
export class Rule extends Lint.Rules.AbstractRule {

  public apply(sourceFile: SourceFile): Lint.RuleFailure[] {
    return this.applyWithWalker(new MeaningfulNamingInTestsWalker(sourceFile, this.getOptions()));
  }
}
