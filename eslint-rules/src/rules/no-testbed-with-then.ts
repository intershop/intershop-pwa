import { AST_NODE_TYPES, TSESLint, TSESTree } from '@typescript-eslint/utils';

import { normalizePath } from '../helpers';

const messages = {
  testbedWithThenError: `Chaining off TestBed.configureTestingModule can be replaced by adding another beforeEach block without async.`,
};

/**
 * Disallows chaining off TestBed.configureTestingModule.
 * Use another beforeEach block instead.
 */
const noTestbedWithThenRule: TSESLint.RuleModule<keyof typeof messages> = {
  defaultOptions: undefined,
  meta: {
    messages,
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

export default noTestbedWithThenRule;
