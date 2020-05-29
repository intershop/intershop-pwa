import { tsquery } from '@phenomnomnominal/tsquery';
import * as fs from 'fs';
import * as Lint from 'tslint';
import * as ts from 'typescript';

import { RuleHelpers } from './ruleHelpers';

const SHOULD_BE_CREATED_NAME = 'should be created';

export class Rule extends Lint.Rules.AbstractRule {
  static fsExistsSync(myDir: string): boolean {
    try {
      fs.accessSync(myDir);
      return true;
    } catch (e) {
      return false;
    }
  }

  private static checkCreationTestContent(ctx: Lint.WalkContext<void>, node: ts.ExpressionStatement) {
    const shouldBeCreatedBlock = node.getChildAt(0).getChildAt(2).getChildAt(2).getChildAt(4).getChildAt(1);

    if (!shouldBeCreatedBlock.getChildren().some(Rule.findComponentTruthy)) {
      ctx.addFailureAtNode(node, `'${SHOULD_BE_CREATED_NAME}' block does not test if component is truthy`);
    }

    if (!shouldBeCreatedBlock.getChildren().some(Rule.findElementTruthy)) {
      ctx.addFailureAtNode(node, `'${SHOULD_BE_CREATED_NAME}' block does not test if html element is truthy`);
    }

    if (!shouldBeCreatedBlock.getChildren().some(Rule.findDetectChangesNotThrow)) {
      ctx.addFailureAtNode(
        node,
        `'${SHOULD_BE_CREATED_NAME}' block does not test if feature.detectChanges does not throw`
      );
    }
  }

  private static findComponentTruthy(node: ts.ExpressionStatement): boolean {
    return node.getText().search(/.*component.*toBeTruthy.*/) >= 0;
  }

  private static findElementTruthy(node: ts.ExpressionStatement): boolean {
    return node.getText().search(/.*lement.*toBeTruthy.*/) >= 0;
  }

  private static findDetectChangesNotThrow(node: ts.ExpressionStatement): boolean {
    return node.getText().search(/[\s\S]*fixture[\s\S]*detectChanges[\s\S]*not\.toThrow[\s\S]*/) >= 0;
  }

  private static reportMissingCreationTest(ctx: Lint.WalkContext<void>) {
    const message = `component does not have an active '${SHOULD_BE_CREATED_NAME}' test`;
    const failuteToken = tsquery(ctx.sourceFile, 'ClassDeclaration > Identifier')[0];
    ctx.addFailureAtNode(failuteToken, message);
  }

  apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    return this.applyWithFunction(sourceFile, this.visitSourceFile);
  }

  visitSourceFile(ctx: Lint.WalkContext<void>) {
    if (ctx.sourceFile.fileName.search(/.(component|container).ts/) > 0) {
      const fileName = ctx.sourceFile.fileName;
      const testName = fileName.substring(0, fileName.length - 2) + 'spec.ts';
      if (!Rule.fsExistsSync(testName)) {
        Rule.reportMissingCreationTest(ctx);
      }
    } else if (ctx.sourceFile.fileName.search(/.(component|container).spec.ts/) > 0) {
      const describe = RuleHelpers.getDescribeBody(ctx.sourceFile);
      if (describe) {
        const creationCheck = describe
          .getChildren()
          .find(
            n =>
              n.kind === ts.SyntaxKind.ExpressionStatement &&
              n.getText().startsWith(`it('${SHOULD_BE_CREATED_NAME}', () => {`)
          );

        if (!creationCheck) {
          ctx.addFailureAt(0, 1, `component does not have a '${SHOULD_BE_CREATED_NAME}' test`);
        } else {
          Rule.checkCreationTestContent(ctx, creationCheck as ts.ExpressionStatement);
        }
      } else {
        Rule.reportMissingCreationTest(ctx);
      }
    }
  }
}
