import { AST_NODE_TYPES, TSESLint, TSESTree } from '@typescript-eslint/utils';

const messages = {
  explicitPseudoTypeError: `Don't define types prefixed by '#', as this is reserved for reusable configuration pseudo-types.`,
};

/**
 * Disallows explicitly prefixing formly field types with '#',
 * as this is reserved for reusable configuration pseudo-types.
 */
const noFormlyExplicitPseudoTypeRule: TSESLint.RuleModule<keyof typeof messages> = {
  defaultOptions: undefined,
  meta: {
    messages,
    type: 'problem',
    schema: [],
  },
  create: context => {
    if (!context.getFilename().endsWith('module.ts')) {
      return {};
    }
    return {
      'Decorator CallExpression[callee.object.name="FormlyBaseModule"] Property[key.name="types"]>ArrayExpression'(
        node: TSESTree.ArrayExpression
      ) {
        node.elements.forEach(formlyTypeDeclaration => {
          if (hasPrefixedNameProperty(formlyTypeDeclaration)) {
            context.report({
              node: formlyTypeDeclaration,
              messageId: 'explicitPseudoTypeError',
            });
          }
        });
      },
    };
  },
};

function hasPrefixedNameProperty(node: TSESTree.Node) {
  return (
    node.type === AST_NODE_TYPES.ObjectExpression &&
    node.properties.find(
      property =>
        property.type === AST_NODE_TYPES.Property &&
        property.key.type === AST_NODE_TYPES.Identifier &&
        property.key.name === 'name' &&
        property.value.type === AST_NODE_TYPES.Literal &&
        property.value.value.toString().startsWith('#')
    )
  );
}

export default noFormlyExplicitPseudoTypeRule;
