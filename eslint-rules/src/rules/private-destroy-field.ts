import { AST_NODE_TYPES, TSESLint, TSESTree } from '@typescript-eslint/utils';
import { once } from 'lodash';

import { isType } from '../helpers';

const messages = {
  privateDestroyError: `Property should be private.`,
  voidSubjectError: `Property should use Subject<void>.`,
  bothError: `Property should be private and use Subject<void>.`,
};

/**
 * Validates and fixes missing private accessibility for the destroy$ property in components, directives and pipes.
 */
const privateDestroyFieldRule: TSESLint.RuleModule<keyof typeof messages> = {
  defaultOptions: undefined,
  meta: {
    messages,
    fixable: 'code',
    type: 'problem',
    schema: [],
  },
  create: context => ({
    // eslint-disable-next-line complexity
    'PropertyDefinition[value.type="NewExpression"]'(node: TSESTree.PropertyDefinition) {
      if (!isType(node.parent.parent as TSESTree.ClassDeclaration, ['Component', 'Directive', 'Pipe'])) {
        return;
      }

      const usesPrivateAccessibility = once(() => node.accessibility === 'private');

      const usesVoidTypeParam = once(
        () =>
          node.value.type === AST_NODE_TYPES.NewExpression &&
          node.value.typeParameters?.params[0].type === AST_NODE_TYPES.TSVoidKeyword
      );

      const usesSubjectType = once(
        () =>
          node.value.type === AST_NODE_TYPES.NewExpression &&
          node.value.callee.type === AST_NODE_TYPES.Identifier &&
          node.value.callee.name === 'Subject'
      );

      if (
        node.key.type === AST_NODE_TYPES.Identifier &&
        node.key.name.match(/^destroy(\$|)$/) &&
        (!usesPrivateAccessibility() || !usesVoidTypeParam() || !usesSubjectType())
      ) {
        if (usesSubjectType()) {
          // replace access modifier or lack thereof with private
          const replaceText = context
            .getSourceCode()
            .getText(node)
            .replace(/^(.*)(?=destroy\$)/, 'private ')
            .replace(/Subject(<.*?>|)/, 'Subject<void>');
          context.report({
            node,
            messageId: usesVoidTypeParam()
              ? 'privateDestroyError'
              : usesPrivateAccessibility()
              ? 'voidSubjectError'
              : 'bothError',
            fix: fixer => fixer.replaceText(node, replaceText),
          });
        } else {
          context.report({
            node,
            messageId: usesPrivateAccessibility() ? 'voidSubjectError' : 'bothError',
          });
        }
      }
    },
  }),
};

export default privateDestroyFieldRule;
