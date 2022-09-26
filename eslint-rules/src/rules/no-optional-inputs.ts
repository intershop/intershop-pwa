import { Selectors } from '@angular-eslint/utils';
import { AST_NODE_TYPES, TSESLint, TSESTree } from '@typescript-eslint/utils';

const messages = {
  doNotUseOptionalOperatorOnInputs: 'Angular @Input() properties are optional by default.',
};

const noOptionalInputsRule: TSESLint.RuleModule<keyof typeof messages> = {
  defaultOptions: undefined,
  meta: {
    messages,
    type: 'problem',
    fixable: 'code',
    schema: [],
    docs: {
      description: 'Disallow optional inputs',
      recommended: 'warn',
    },
  },
  create: context => ({
    [Selectors.INPUT_DECORATOR](node: TSESTree.Decorator): void {
      if (
        node.parent.type === AST_NODE_TYPES.PropertyDefinition &&
        node.parent.key.type === AST_NODE_TYPES.Identifier &&
        node.parent.key.parent.type === AST_NODE_TYPES.PropertyDefinition &&
        node.parent.key.parent.optional
      ) {
        const loc = node.parent.key.range[1];
        context.report({
          node: node.parent.key.parent,
          messageId: 'doNotUseOptionalOperatorOnInputs',
          fix(fixer) {
            return fixer.removeRange([loc, loc + 1]);
          },
        });
      }
    },
  }),
};

export default noOptionalInputsRule;
