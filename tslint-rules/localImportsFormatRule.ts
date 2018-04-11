import * as Lint from 'tslint';
import { ImportDeclaration, SourceFile, SyntaxKind } from 'typescript';
import { RuleHelpers } from './ruleHelpers';

class LocalImportsFormatPluginWalker extends Lint.RuleWalker {

  visitImportDeclaration(importStatement: ImportDeclaration) {
    let applyLikeAutoImportPlugin: boolean;
    if (this.getOptions()[0] === 'AutoImportPlugin') {
      applyLikeAutoImportPlugin = true;
    } else if (this.getOptions()[0] === 'TypeScriptHeroPlugin') {
      applyLikeAutoImportPlugin = false;
    } else {
      const message = 'as configuration for local-imports-format rule only "AutoImportPlugin" and "TypeScriptHeroPlugin" are valid values';
      throw new Error(message);
    }

    const token = RuleHelpers.getNextChildTokenOfKind(importStatement, SyntaxKind.StringLiteral);
    const text = token.getText();
    if (applyLikeAutoImportPlugin) {
      if (text.charAt(1) === '.' && text.charAt(2) !== '/') {
        const replaceString = text.substring(0, 1) + './' + text.substring(1, text.length);
        const fix = new Lint.Replacement(token.getStart(), token.getWidth(), replaceString);
        this.addFailureAtNode(token, 'local import statements must start with "./", consider using AutoImport Plugin', fix);
      }
    } else {
      if (text.substring(1, 4) === './.') {
        const replaceString = text.substring(0, 1) + text.substring(3, text.length);
        const fix = new Lint.Replacement(token.getStart(), token.getWidth(), replaceString);
        this.addFailureAtNode(token, 'local relative import statements must not start with "./", consider using TypeScript Hero Plugin', fix);
      }
    }
  }
}

/**
 * Implementation of the local-imports-format rule.
 */
export class Rule extends Lint.Rules.AbstractRule {

  apply(sourceFile: SourceFile): Lint.RuleFailure[] {
    return this.applyWithWalker(new LocalImportsFormatPluginWalker(sourceFile, this.getOptions()));
  }
}
