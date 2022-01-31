import { AST_NODE_TYPES, TSESLint, TSESTree } from '@typescript-eslint/experimental-utils';

import { isComponent } from '../helpers';

/**
 * Forbids the direct initialization of observables .
 * Don't initialize observable class properties directly, for example through `new Observable()`.
 *  Use `ngOnInit` instead.
 */
export const noInitializeObservablesDirectlyRule: TSESLint.RuleModule<string, []> = {
  meta: {
    messages: {
      wrongInitializeError: 'Observable stream should be initialized in ngOnInit',
    },
    type: 'problem',
    schema: [],
  },
  create: context => ({
    'PropertyDefinition[value.type="NewExpression"]'(node: TSESTree.PropertyDefinition) {
      if (!isComponent(node.parent.parent as TSESTree.ClassDeclaration)) {
        return;
      }
      const newExpression = node.value as TSESTree.NewExpression;
      if (
        node.key.type === AST_NODE_TYPES.Identifier &&
        node.key.name.match(/\w*\$$/) &&
        newExpression.callee.type === AST_NODE_TYPES.Identifier &&
        !newExpression.callee.name.includes('Subject')
      ) {
        context.report({
          node,
          messageId: 'wrongInitializeError',
        });
      }
    },
  }),
};
