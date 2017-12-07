import * as Lint from 'tslint';
import { PropertyAssignment, SourceFile, SyntaxKind } from 'typescript';

class UseCamelCaseEnvironmentPropertiesWalker extends Lint.RuleWalker {

  public visitSourceFile(sourceFile: SourceFile) {
    if (sourceFile.fileName.match(/.*\/environment[\.\w]*\.ts/)) {
      super.visitSourceFile(sourceFile);
    }
  }

  public visitPropertyAssignment(propertyAssignment: PropertyAssignment) {
    propertyAssignment.getChildren().forEach(token => {
      if (token.kind === SyntaxKind.Identifier) {
        const identifier = token.getText();
        if (!identifier.match(/^[a-z][A-Za-z0-9]*$/)) {
          super.addFailureAtNode(token, `Property ${token.getText()} is not camelCase formatted.`);
        }
      }
    });
    super.visitPropertyAssignment(propertyAssignment);
  }
}

/**
 * Implementation of the use-camel-case-environment-properties rule.
 */
export class Rule extends Lint.Rules.AbstractRule {

  public apply(sourceFile: SourceFile): Lint.RuleFailure[] {
    return this.applyWithWalker(new UseCamelCaseEnvironmentPropertiesWalker(sourceFile, this.getOptions()));
  }
}
