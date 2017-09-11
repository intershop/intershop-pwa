import { SyntaxKind, SourceFile } from 'typescript';
import * as Lint from 'tslint';
import { forEachToken, getNextToken } from 'tsutils';

const DESCRIPTION_REGEX = /^'should(.* (when|if|until|on) .*| be created)'$/;

class MeaningfulNamingInTestsWalker extends Lint.RuleWalker {

    public visitSourceFile(sourceFile: SourceFile) {
        if (sourceFile.fileName.search('.spec.ts') > 0) {

            // console.log('####' + sourceFile.fileName);
            forEachToken(sourceFile, (node) => {
                // console.log(node.kind + ': ' + node.getText());
                if (node.kind === SyntaxKind.Identifier && node.getText() === 'it') {
                    do {
                        node = getNextToken(node);
                    } while (node.kind !== SyntaxKind.StringLiteral);
                    if (node) {
                        const description = node.getText();
                        if (!DESCRIPTION_REGEX.test(description)) {
                            this.addFailureAtNode(node, '"' + description + '" does not match ' + DESCRIPTION_REGEX);
                        }
                    }
                }
            });
        }
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
