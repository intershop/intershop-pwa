import { AST_NODE_TYPES, TSESLint, TSESTree } from '@typescript-eslint/utils';

import { isComponent } from '../helpers';

const messages = {
  wrongInitializeError: 'Observable stream should be initialized in ngOnInit',
};

/**
 * Forbids the direct initialization of observables .
 * Don't initialize observable class properties directly, for example through `new Observable()`.
 *  Use `ngOnInit` instead.
 */
const noInitializeObservablesDirectlyRule: TSESLint.RuleModule<keyof typeof messages> = {
  defaultOptions: undefined,
  meta: {
    messages,
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
    'MethodDefinition[key.name="constructor"] AssignmentExpression[right.type="NewExpression"]'(
      node: TSESTree.AssignmentExpression
    ) {
      if (node.left.type === AST_NODE_TYPES.Identifier && node.left.name.match(/\w*\$$/)) {
        context.report({
          node,
          messageId: 'wrongInitializeError',
        });
      }
    },
  }),
};

export default noInitializeObservablesDirectlyRule;
