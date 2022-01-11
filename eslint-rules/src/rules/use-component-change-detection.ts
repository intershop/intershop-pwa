import { AST_NODE_TYPES, TSESLint, TSESTree } from '@typescript-eslint/experimental-utils';

import { normalizePath, objectContainsProperty } from '../helpers';

/**
 * Enforces the explicit declaration of `changeDetection` in component decorators.
 */
export const useComponentChangeDetectionRule: TSESLint.RuleModule<string, []> = {
  meta: {
    messages: {
      noChangeDetectionError: `Components should explicitly declare "changeDetection", preferably "ChangeDetectionStrategy.OnPush"`,
    },
    type: 'problem',
    schema: [],
  },
  create: context => {
    // only apply to component files
    if (normalizePath(context.getFilename()).search(/.(component|container).ts/) < 0) {
      return {};
    }
    return {
      Decorator(node) {
        // only test relevant decorators
        if (
          node.parent.type === AST_NODE_TYPES.ClassDeclaration &&
          node.expression.type === AST_NODE_TYPES.CallExpression &&
          node.expression.callee.type === AST_NODE_TYPES.Identifier &&
          node.expression.callee.name === 'Component' &&
          !configurationArgumentsContainChangeDetection(node.expression.arguments)
        ) {
          // test if decorator argument object includes changeDetection property
          context.report({
            node,
            messageId: 'noChangeDetectionError',
          });
        }
      },
    };
  },
};

function configurationArgumentsContainChangeDetection(config: TSESTree.CallExpressionArgument[]): boolean {
  return (
    config && config[0].type === AST_NODE_TYPES.ObjectExpression && objectContainsProperty(config[0], 'changeDetection')
  );
}
