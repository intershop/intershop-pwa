import { tsquery } from '@phenomnomnominal/tsquery';
import * as Lint from 'tslint';
import * as ts from 'typescript';

function isDoneCallback(block: ts.Node): boolean {
  return block.getText() === 'done' || block.getText().search(/\sdone\(\)/) >= 0;
}

function isDoneInSetTimeout(s: ts.Statement): boolean {
  return (
    ts.isExpressionStatement(s) &&
    ts.isCallExpression(s.expression) &&
    s.expression.expression.getText() === 'setTimeout' &&
    isDoneCallback(s.expression.arguments[0])
  );
}

function isDoneCalledExplicitly(s: ts.Statement): boolean {
  return (
    ts.isExpressionStatement(s) && ts.isCallExpression(s.expression) && s.expression.expression.getText() === 'done'
  );
}

function isDoneCallbackPartialSubscriber(e: ts.Expression): boolean {
  return (
    ts.isObjectLiteralExpression(e) &&
    e.properties
      .filter(p => ts.isPropertyAssignment(p))
      .filter(p => ['next', 'complete', 'error'].includes(p.name.getText()))
      .some((p: ts.PropertyAssignment) => isDoneCallback(p.initializer))
  );
}

export class Rule extends Lint.Rules.AbstractRule {
  apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    if (!sourceFile.fileName.endsWith('.spec.ts')) {
      return [];
    }

    return this.applyWithFunction(sourceFile, ctx => {
      tsquery(ctx.sourceFile, 'PropertyAccessExpression:has(Identifier[name=subscribe])')
        .map(subscribe => subscribe.parent as ts.CallExpression)
        // subscribe itself contains done callback
        .filter(call => !call.arguments.some(isDoneCallback))
        // subscribe itself contains done callback in partial subscriber
        .filter(call => !call.arguments.some(isDoneCallbackPartialSubscriber))
        // current test block is fakeAsync
        .filter(call => {
          let current: ts.Node = call;
          while (!ts.isSourceFile(current.parent)) {
            current = current.parent;
            if (ts.isCallExpression(current) && current.expression.getText() === 'fakeAsync') {
              return false;
            }
          }
          return true;
        })
        // done callback is used in block somewhere else
        .filter(call => {
          let current: ts.Node = call;
          while (!ts.isSourceFile(current.parent)) {
            current = current.parent;
            if (ts.isArrowFunction(current) && current.parameters.some(p => p.name.getText() === 'done')) {
              const body = current.body;
              return (
                ts.isBlock(body) &&
                !body.statements.some(isDoneInSetTimeout) &&
                !body.statements.some(isDoneCalledExplicitly)
              );
            }
          }
          return true;
        })
        .forEach(call => {
          ctx.addFailureAtNode(
            tsquery(call, 'Identifier[name=subscribe]')[0],
            'asynchronous operations in tests should call done callback, see https://facebook.github.io/jest/docs/en/asynchronous.html'
          );
        });
    });
  }
}
