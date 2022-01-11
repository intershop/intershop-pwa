import { AST_NODE_TYPES, TSESLint, TSESTree } from '@typescript-eslint/experimental-utils';

import { normalizePath } from '../helpers';

/**
 * Disallows type assertions (`exampleObject as ExampleType`) on object literals.
 */
export const noObjectLiteralTypeAssertionRule: TSESLint.RuleModule<string, []> = {
  meta: {
    messages: {
      noObjectLiteralTypeAssertionError: `Type assertion on object literals is forbidden, use a type annotation instead.`,
    },
    type: 'problem',
    schema: [],
  },
  create: context => {
    const filePattern = /^((?!(\/dev\/|\/eslint-rules\/|spec.ts$)).)*$/;
    if (filePattern.test(normalizePath(context.getFilename()))) {
      return {
        TSAsExpression(node: TSESTree.TSAsExpression) {
          if (node.expression.type === AST_NODE_TYPES.ObjectExpression) {
            context.report({
              node,
              messageId: 'noObjectLiteralTypeAssertionError',
            });
          }
        },
      };
    }
    return {};
  },
};
