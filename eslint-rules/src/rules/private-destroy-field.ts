import { AST_NODE_TYPES, TSESLint, TSESTree } from '@typescript-eslint/experimental-utils';

import { isType } from '../helpers';

/**
 * Validates and fixes missing private accessibility for the destroy$ property in components, directives and pipes.
 */
export const privateDestroyFieldRule: TSESLint.RuleModule<string, []> = {
  meta: {
    messages: {
      privateDestroyError: `Property should be private.`,
    },
    fixable: 'code',
    type: 'problem',
    schema: [],
  },
  create: context => ({
    'ClassProperty[value.type="NewExpression"]'(node: TSESTree.ClassProperty) {
      if (!isType(node.parent.parent as TSESTree.ClassDeclaration, ['Component', 'Directive', 'Pipe'])) {
        return;
      }

      const newExpression = node.value as TSESTree.NewExpression;
      if (
        node.key.type === AST_NODE_TYPES.Identifier &&
        node.key.name.match(/^destroy(\$|)$/) &&
        node.key.type === AST_NODE_TYPES.Identifier &&
        newExpression.parent?.type === AST_NODE_TYPES.ClassProperty &&
        !(newExpression.parent?.accessibility === 'private')
      ) {
        context.report({
          node,
          messageId: 'privateDestroyError',
          fix: fixer => fixer.insertTextBefore(node, 'private '),
        });
      }
    },
  }),
};
