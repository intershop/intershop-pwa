import { SyntaxKind, SourceFile } from 'typescript';
import * as Lint from 'tslint';
import { RuleHelpers } from './ruleHelpers';

class PreferMocksInsteadOfStubsInTestsWalker extends Lint.RuleWalker {

    public visitSourceFile(sourceFile: SourceFile) {
        if (sourceFile.fileName.search('.spec.ts') > 0) {
            // console.log('####' + sourceFile.fileName);
            // if (!sourceFile.fileName.endsWith('registration-page.component.spec.ts')) {
            //     return;
            // }

            const describeBody = RuleHelpers.getDescribeBody(sourceFile);
            if (describeBody) {
                describeBody.getChildren().forEach(child => {
                    if (child.kind === SyntaxKind.ClassDeclaration) {
                        // console.log(child.kind + ': ' + child.getText());
                        const classNameToken = RuleHelpers.getNextChildTokenOfKind(child, SyntaxKind.Identifier);
                        if (classNameToken) {
                            const className = classNameToken.getText();
                            if (/.*Stub/.test(className)) {
                                this.addFailureAtNode(child, 'Do not use stub classes like "' + className +
                                    '". Use the capabilities of ts-mockito instead.');
                            }
                        }
                    }
                });
            }
        }
    }
}

/**
 * Implementation of the prefer-mocks-instead-of-stubs-in-tests rule.
 */
export class Rule extends Lint.Rules.AbstractRule {

    public apply(sourceFile: SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new PreferMocksInsteadOfStubsInTestsWalker(sourceFile, this.getOptions()));
    }
}
