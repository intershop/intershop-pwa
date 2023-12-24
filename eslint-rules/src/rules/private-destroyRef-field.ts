import { AST_NODE_TYPES, TSESLint, TSESTree } from '@typescript-eslint/utils';
import { once } from 'lodash';

import { isType } from '../helpers';

const messages = {
  privateDestroyRefError: `Property should be private.`,
  injectDestroyRefError: `Property should use inject(DestroyRef).`,
  bothError: `Property should be private and use inject(DestroyRef).`,
};

/**
 * Validates and fixes missing private accessibility for the destroy$ property in components, directives and pipes.
 */
const privateDestroyRefFieldRule: TSESLint.RuleModule<keyof typeof messages> = {
  defaultOptions: undefined,
  meta: {
    messages,
    fixable: 'code',
    type: 'problem',
    schema: [],
  },
  create: context => ({
    // eslint-disable-next-line complexity
    'PropertyDefinition[value.type="CallExpression"]'(node: TSESTree.PropertyDefinition) {
      if (!isType(node.parent.parent as TSESTree.ClassDeclaration, ['Component', 'Directive', 'Pipe'])) {
        return;
      }

      const usesPrivateAccessibility = once(() => node.accessibility === 'private');

      const usesInjectDependency = once(
        () =>
          node.value.type === AST_NODE_TYPES.CallExpression &&
          node.value.callee.type === AST_NODE_TYPES.Identifier &&
          node.value.callee.name === 'inject'
      );

      const usesDestroyRefArg = once(
        () =>
          node.value.type === AST_NODE_TYPES.CallExpression &&
          node.value.arguments.length === 1 &&
          node.value.arguments[0].type === AST_NODE_TYPES.Identifier &&
          node.value.arguments[0].name === 'DestroyRef'
      );

      if (
        node.key.type === AST_NODE_TYPES.Identifier &&
        node.key.name.match(/^destroyRef$/) &&
        (!usesPrivateAccessibility() || !usesInjectDependency() || !usesDestroyRefArg())
      ) {
        if (usesInjectDependency()) {
          // replace access modifier or lack thereof with private
          const replaceText = context
            .getSourceCode()
            .getText(node)
            .replace(/^(.*)(?=destroyRef)/, 'private ');
          context.report({
            node,
            messageId: usesDestroyRefArg()
              ? 'privateDestroyRefError'
              : usesPrivateAccessibility()
              ? 'injectDestroyRefError'
              : 'bothError',
            fix: fixer => fixer.replaceText(node, replaceText),
          });
        } else {
          context.report({
            node,
            messageId: usesPrivateAccessibility() ? 'injectDestroyRefError' : 'bothError',
          });
        }
      }
    },
  }),
};

export default privateDestroyRefFieldRule;
