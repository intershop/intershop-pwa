import { NgWalker } from 'codelyzer/angular/ngWalker';
import * as Lint from 'tslint';
import * as ts from 'typescript';

class UseComponentChangeDetectionWalker extends NgWalker {

  forceOnPush = true;

  constructor(sourceFile: ts.SourceFile, options: Lint.IOptions) {
    super(sourceFile, options);
    if (options['ruleArguments'][0]) {
      this.forceOnPush = !!options['ruleArguments'][0]['forceOnPush'];
    }
  }

  visitClassDecorator(decorator: ts.Decorator) {
    if (decorator.expression.getChildAt(0).getText() === 'Component') {
      const componentProperties = decorator.expression.getChildAt(2) as ts.SyntaxList;
      // tslint:disable-next-line:no-any
      const map = (componentProperties.getChildAt(0) as any).symbol.members as ts.Map<any>;

      if (!map.has('changeDetection')) {
        if (!this.forceOnPush) {
          super.addFailureAtNode(decorator, 'Component should declare "changeDetection", preferrably "ChangeDetectionStrategy.OnPush"');
        } else if (!map.get('changeDetection') || map.get('changeDetection').valueDeclaration.getText().indexOf('OnPush') < 0) {
          super.addFailureAtNode(decorator, 'Component should declare "changeDetection: ChangeDetectionStrategy.OnPush"');
        }
      } else if (this.forceOnPush && map.get('changeDetection').valueDeclaration.getText().indexOf('OnPush') < 0) {
        super.addFailureAtNode(decorator, 'Component should declare "changeDetection: ChangeDetectionStrategy.OnPush"');
      }
    }
  }
}

/**
 * Implementation of the use-component-change-detection rule.
 */
export class Rule extends Lint.Rules.AbstractRule {

  apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    return this.applyWithWalker(new UseComponentChangeDetectionWalker(sourceFile, this.getOptions()));
  }
}
