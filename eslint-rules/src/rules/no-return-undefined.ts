import { AST_NODE_TYPES, TSESLint } from '@typescript-eslint/utils';

const messages = {
  undefinedError: `Don't return undefined explicitly. Use an empty return instead.`,
};

/**
 * Disallows explicitly returning `undefined`. Use an empty return instead.
 */
const noReturnUndefinedRule: TSESLint.RuleModule<keyof typeof messages> = {
  defaultOptions: undefined,
  meta: {
    messages,
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

export default noReturnUndefinedRule;
