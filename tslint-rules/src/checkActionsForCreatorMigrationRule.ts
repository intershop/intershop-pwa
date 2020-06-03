import { tsquery } from '@phenomnomnominal/tsquery';
import * as Lint from 'tslint';
import * as ts from 'typescript';

/**
 * TODO: this rule becomes obsolete after 0.21 release
 */
export class Rule extends Lint.Rules.AbstractRule {
  apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    if (sourceFile.fileName.endsWith('.actions.ts')) {
      return this.applyWithFunction(sourceFile, ctx => {
        ctx.sourceFile.statements.filter(ts.isClassDeclaration).forEach(actionClass => {
          const enumName = (tsquery(
            actionClass,
            'PropertyDeclaration[name.text=type] > PropertyAccessExpression'
          )[0] as ts.PropertyAccessExpression).name;
          if (enumName.text !== actionClass.name.text) {
            ctx.addFailureAtNode(enumName, 'Enum name does not equal action name.');
          }

          tsquery(actionClass, 'Constructor > Parameter[name.text=payload]').forEach(
            (payload: ts.ParameterDeclaration) => {
              if (payload.initializer || payload.questionToken) {
                ctx.addFailureAtNode(payload, 'Optional payloads are not supported.');
              }
            }
          );
        });
      });
    }
    return [];
  }
}
