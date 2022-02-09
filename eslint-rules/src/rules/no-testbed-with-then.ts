import { AST_NODE_TYPES, TSESLint, TSESTree } from '@typescript-eslint/experimental-utils';

import { normalizePath } from '../helpers';

/**
 * Disallows chaining off TestBed.configureTestingModule.
 * Use another beforeEach block instead.
 */
export const noTestbedWithThenRule: TSESLint.RuleModule<string, []> = {
  meta: {
    messages: {
      testbedWithThenError: `Chaining off TestBed.configureTestingModule can be replaced by adding another beforeEach block without async.`,
    },
    type: 'problem',
    schema: [],
  },
  create: context => {
    if (!normalizePath(context.getFilename()).endsWith('.spec.ts')) {
      return {};
    }
    return {
      'MemberExpression[object.name="TestBed"][property.name="configureTestingModule"]'() {
        // filter ancestors manually so we can report an error at the 'then' position
        const thenNode = context
          .getAncestors()
          .filter(
            ancestor =>
              ancestor.type === AST_NODE_TYPES.MemberExpression &&
              ancestor.property.type === AST_NODE_TYPES.Identifier &&
              ancestor.property.name === 'then'
          );
        if (thenNode.length > 0) {
          context.report({
            node: (thenNode[0] as TSESTree.MemberExpression).property,
            messageId: 'testbedWithThenError',
          });
        }
      },
    };
  },
};
