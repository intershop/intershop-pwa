import { AST_NODE_TYPES, TSESLint } from '@typescript-eslint/experimental-utils';

/**
 * Disallows explicitly returning `undefined`. Use an empty return instead.
 */
export const noReturnUndefinedRule: TSESLint.RuleModule<string, []> = {
  meta: {
    messages: {
      undefinedError: `Don't return undefined explicitly. Use an empty return instead.`,
    },
    fixable: 'code',
    type: 'problem',
    schema: [],
  },
  create: context => ({
    ReturnStatement(node) {
      if (node.argument?.type === AST_NODE_TYPES.Identifier && node.argument.name === 'undefined') {
        context.report({
          node,
          messageId: 'undefinedError',
          fix: fixer => fixer.remove(node.argument),
        });
      }
    },
  }),
};
