import { NgWalker } from 'codelyzer/angular/ngWalker';
import * as Lint from 'tslint';
import * as ts from 'typescript';

const message = 'Component should explicitely declare "changeDetection", preferrably "ChangeDetectionStrategy.OnPush"';

class UseComponentChangeDetectionWalker extends NgWalker {
  constructor(sourceFile: ts.SourceFile, options: Lint.IOptions) {
    super(sourceFile, options);
  }

  visitClassDecorator(decorator: ts.Decorator) {
    if (decorator.expression.getChildAt(0).getText() === 'Component') {
      const componentProperties = decorator.expression.getChildAt(2) as ts.SyntaxList;
      const propertyList = componentProperties.getChildAt(0).getChildAt(1).getChildren();

      const containsChangeDetection =
        propertyList
          .filter(child => child.kind === ts.SyntaxKind.PropertyAssignment)
          .map((assignement: ts.PropertyAssignment) => assignement.name)
          .filter((identifier: ts.Identifier) => identifier.escapedText === 'changeDetection').length === 1;

      if (!containsChangeDetection) {
        super.addFailureAtNode(decorator, message);
      }
    }
  }
}

/**
 * Implementation of the use-component-change-detection rule.
 */
export class Rule extends Lint.Rules.AbstractRule {
  apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    if (sourceFile.fileName.search(/.(component|container).ts/) < 0) {
      return [];
    }
    return this.applyWithWalker(new UseComponentChangeDetectionWalker(sourceFile, this.getOptions()));
  }
}
