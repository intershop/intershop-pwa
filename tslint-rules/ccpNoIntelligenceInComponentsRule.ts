import * as Lint from 'tslint';
import { ImportDeclaration, SourceFile, SyntaxKind } from 'typescript';
import { RuleHelpers } from './ruleHelpers';

interface RuleSetting {
  ngrx: boolean;
  service: boolean;
}

class CCPNoIntelligenceInComponentsWalker extends Lint.RuleWalker {

  ruleSettings: {[key: string]: RuleSetting} = {};
  isContainer: boolean;

  constructor(sourceFile: SourceFile, options: Lint.IOptions) {
    super(sourceFile, options);

    this.ruleSettings['component'] = options['ruleArguments'][0]['component'];
    this.ruleSettings['container'] = options['ruleArguments'][0]['container'];
  }

  visitSourceFile(sourceFile: SourceFile) {
    if (sourceFile.fileName.match(/.*\/(components|containers)\/(?!.*(interface|index|spec|module).ts$).*.ts/)) {
      this.isContainer = sourceFile.fileName.indexOf('/containers/') >= 0;
      super.visitSourceFile(sourceFile);
    }
  }

  visitImportDeclaration(importStatement: ImportDeclaration) {
    const fromStringToken = RuleHelpers.getNextChildTokenOfKind(importStatement, SyntaxKind.StringLiteral);
    const fromStringText = fromStringToken.getText().substring(1, fromStringToken.getText().length - 1);

    let c: string;
    if (this.isContainer) {
      c = 'container';
    } else {
      c = 'component';
    }

    if (fromStringText.search(/\/store(\/|$)/) > 0 && !this.ruleSettings[c].ngrx) {
      this.addFailureAtNode(importStatement, `ngrx handling is not allowed in ${c}s. (found ${importStatement.getText()})`);
    }
    if (fromStringText.search(/\.service$/) > 0 && !this.ruleSettings[c].service) {
      this.addFailureAtNode(importStatement, `service usage is not allowed in ${c}s. (found ${importStatement.getText()})`);
    }
  }
}

/**
 * Implementation of the ccp-no-intelligence-in-components rule.
 */
export class Rule extends Lint.Rules.AbstractRule {

  apply(sourceFile: SourceFile): Lint.RuleFailure[] {
    return this.applyWithWalker(new CCPNoIntelligenceInComponentsWalker(sourceFile, this.getOptions()));
  }
}
