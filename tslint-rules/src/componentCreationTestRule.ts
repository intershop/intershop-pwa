import * as fs from 'fs';
import * as Lint from 'tslint';
import * as ts from 'typescript';
import { RuleHelpers } from './ruleHelpers';

const SHOULD_BE_CREATED_NAME = 'should be created';

class ComponentCreationTestWalker extends Lint.RuleWalker {
  private warnOnlyOnMissing = false;

  constructor(sourceFile: ts.SourceFile, options: Lint.IOptions) {
    super(sourceFile, options);
    this.warnOnlyOnMissing = this.getOptions()[0] === 'warn';
  }

  visitSourceFile(sourceFile: ts.SourceFile) {
    if (sourceFile.fileName.search(/.(component|container).ts/) > 0) {
      const fileName = sourceFile.fileName;
      const testName = fileName.substring(0, fileName.length - 2) + 'spec.ts';
      if (!this.fsExistsSync(testName)) {
        this.reportMissingCreationTest(sourceFile);
      }
    } else if (sourceFile.fileName.search(/.(component|container).spec.ts/) > 0) {
      const describe = RuleHelpers.getDescribeBody(sourceFile);
      if (describe) {
        const creationCheck = describe
          .getChildren()
          .find(
            n =>
              n.kind === ts.SyntaxKind.ExpressionStatement &&
              n.getText().startsWith(`it('${SHOULD_BE_CREATED_NAME}', () => {`)
          );

        if (!creationCheck) {
          super.addFailureAt(0, 1, `component does not have a '${SHOULD_BE_CREATED_NAME}' test`);
        } else {
          this.checkCreationTestContent(creationCheck as ts.ExpressionStatement);
        }

        super.visitSourceFile(sourceFile);
      } else {
        this.reportMissingCreationTest(sourceFile);
      }
    }
  }

  private fsExistsSync(myDir: string): boolean {
    try {
      fs.accessSync(myDir);
      return true;
    } catch (e) {
      return false;
    }
  }

  private checkCreationTestContent(node: ts.ExpressionStatement) {
    const shouldBeCreatedBlock = node
      .getChildAt(0)
      .getChildAt(2)
      .getChildAt(2)
      .getChildAt(4)
      .getChildAt(1);

    const orReduce = (l: boolean, r: boolean) => l || r;

    if (
      !shouldBeCreatedBlock
        .getChildren()
        .map(this.findComponentTruthy)
        .reduce(orReduce, false)
    ) {
      super.addFailureAtNode(node, `'${SHOULD_BE_CREATED_NAME}' block does not test if component is truthy`);
    }

    if (
      !shouldBeCreatedBlock
        .getChildren()
        .map(this.findElementTruthy)
        .reduce(orReduce, false)
    ) {
      super.addFailureAtNode(node, `'${SHOULD_BE_CREATED_NAME}' block does not test if html element is truthy`);
    }

    if (
      !shouldBeCreatedBlock
        .getChildren()
        .map(this.findDetectChangesNotThrow)
        .reduce(orReduce, false)
    ) {
      super.addFailureAtNode(
        node,
        `'${SHOULD_BE_CREATED_NAME}' block does not test if feature.detectChanges does not throw`
      );
    }
  }

  private findComponentTruthy(node: ts.ExpressionStatement): boolean {
    return node.getText().search(/.*component.*toBeTruthy.*/) >= 0;
  }

  private findElementTruthy(node: ts.ExpressionStatement): boolean {
    return node.getText().search(/.*lement.*toBeTruthy.*/) >= 0;
  }

  private findDetectChangesNotThrow(node: ts.ExpressionStatement): boolean {
    return node.getText().search(/[\s\S]*fixture[\s\S]*detectChanges[\s\S]*not\.toThrow[\s\S]*/) >= 0;
  }

  private reportMissingCreationTest(sourceFile: ts.SourceFile) {
    const message = `component does not have an active '${SHOULD_BE_CREATED_NAME}' test`;
    if (this.warnOnlyOnMissing) {
      console.warn(sourceFile.fileName, message);
    } else {
      super.addFailureAt(0, 1, message);
    }
  }
}

/**
 * Implementation of the component-creation-test rule.
 */
export class Rule extends Lint.Rules.AbstractRule {
  apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    return this.applyWithWalker(new ComponentCreationTestWalker(sourceFile, this.getOptions()));
  }
}
