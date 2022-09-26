import { AST_NODE_TYPES, TSESLint, TSESTree } from '@typescript-eslint/utils';

import { normalizePath } from '../helpers';

const messages = {
  noObjectLiteralTypeAssertionError: `Type assertion on object literals is forbidden, use a type annotation instead.`,
};

/**
 * Disallows type assertions (`exampleObject as ExampleType`) on object literals.
 */
const noObjectLiteralTypeAssertionRule: TSESLint.RuleModule<keyof typeof messages> = {
  defaultOptions: undefined,
  meta: {
    messages,
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

export default noObjectLiteralTypeAssertionRule;
