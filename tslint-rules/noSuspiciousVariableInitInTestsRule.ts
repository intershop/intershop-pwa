import { SyntaxKind, SourceFile } from 'typescript';
import * as Lint from 'tslint';
import { forEachTokenWithTrivia } from 'tsutils';

class NoSuspiciousVariableInitInTestsWalker extends Lint.RuleWalker {

    public visitSourceFile(node: SourceFile) {
        if (node.fileName.search('.spec.ts') > 0) {
            let currentLevel = -1000;
            let beforeEachLevel = 1000;
            let inspectBeforeEach = false;
            let interestedInNextIdentifier = false;

            const declaredVariables = [];
            const declaredVariablesRange = [];
            const foundInBeforeEachVariables = [];

            // console.log('####' + node.fileName);
            forEachTokenWithTrivia(node, (text, tokenSyntaxKind, range) => {
                if (interestedInNextIdentifier && tokenSyntaxKind === SyntaxKind.Identifier) {
                    const declaration = text.substring(range.pos, text.indexOf(';', range.pos));
                    if (declaration.search(' = ') > 0) {
                        this.addFailureAt(range.pos, range.end - range.pos, 'variable "' + text.substring(range.pos, range.end) + '" should only be initialized as const here or initialized in beforeEach.');
                    } else {
                        declaredVariables.push(text.substring(range.pos, range.end));
                        declaredVariablesRange.push(range);
                    }
                    interestedInNextIdentifier = false;
                }

                if (currentLevel === 0 && tokenSyntaxKind === SyntaxKind.LetKeyword) {
                    // console.log(hot  + ' declaration in describe: ' + text.substring(range.pos, text.indexOf(';', range.pos)));
                    interestedInNextIdentifier = true;
                }
                if (inspectBeforeEach && tokenSyntaxKind === SyntaxKind.Identifier) {
                    // console.log('token level ' + hot + ': ' + tokenSyntaxKind + ': ' + text.substring(range.pos, range.end));
                    if (inspectBeforeEach && beforeEachLevel === currentLevel) {
                        inspectBeforeEach = false;
                    }
                }
                if (currentLevel >= 0) {
                    if (tokenSyntaxKind === SyntaxKind.Identifier && text.substring(range.pos, range.end) === 'beforeEach') {
                        // console.log(hot  + ' found beforeEach');
                        beforeEachLevel = currentLevel;
                        inspectBeforeEach = true;
                    }
                    if (inspectBeforeEach) {
                        // console.log(' token level ' + hot + ': ' + tokenSyntaxKind + ': ' + text.substring(range.pos, range.end));
                        if (tokenSyntaxKind === SyntaxKind.Identifier) {
                            const toNextSemicolon = text.substring(range.pos, text.indexOf(';', range.pos));
                            if (toNextSemicolon.search(' = ') > 0) {
                                // console.log(hot  + ' assignment in beforeEach: ' + text.substring(range.pos, text.indexOf(';', range.pos)));
                                foundInBeforeEachVariables.push(text.substring(range.pos, range.end));
                            }
                        }
                    }
                }


                if (tokenSyntaxKind === SyntaxKind.Identifier && text.substring(range.pos, range.end) === 'describe') {
                    currentLevel = -2;
                }
                if (tokenSyntaxKind === SyntaxKind.OpenBraceToken || tokenSyntaxKind === SyntaxKind.OpenParenToken) {
                    currentLevel++;
                }
                if (tokenSyntaxKind === SyntaxKind.CloseBraceToken || tokenSyntaxKind === SyntaxKind.CloseParenToken) {
                    currentLevel--;
                }
            });

            if (declaredVariables.length) {
                const missing = declaredVariables.filter((key) => foundInBeforeEachVariables.indexOf(key) < 0);
                if (missing.length) {
                    missing.forEach((key) => {
                        const index = declaredVariables.indexOf(key);
                        const range = declaredVariablesRange[index];
                        this.addFailureAt(range.pos, range.end - range.pos, 'variable "' + key + '" is not re-initialized in beforeEach.');
                    });
                }
            }
        }
    }
}

/**
 * Implementation of the no-suspicious-variable-init-in-tests rule.
 */
export class Rule extends Lint.Rules.AbstractRule {

    public apply(sourceFile: SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new NoSuspiciousVariableInitInTestsWalker(sourceFile, this.getOptions()));
    }
}
