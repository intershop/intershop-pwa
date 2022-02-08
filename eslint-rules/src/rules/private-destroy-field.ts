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
    'PropertyDefinition[value.type="NewExpression"]'(node: TSESTree.PropertyDefinition) {
      if (!isType(node.parent.parent as TSESTree.ClassDeclaration, ['Component', 'Directive', 'Pipe'])) {
        return;
      }

      if (
        node.key.type === AST_NODE_TYPES.Identifier &&
        node.key.name.match(/^destroy(\$|)$/) &&
        node.accessibility !== 'private'
      ) {
        // replace access modifier or lack thereof with private
        const replaceText = context
          .getSourceCode()
          .getText(node)
          .replace(/^(.*)(?=destroy\$)/, 'private ');
        context.report({
          node,
          messageId: 'privateDestroyError',
          fix: fixer => fixer.replaceText(node, replaceText),
        });
      }
    },
  }),
};
