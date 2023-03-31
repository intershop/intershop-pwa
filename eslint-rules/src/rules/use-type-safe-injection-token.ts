import { TSESLint, TSESTree } from '@typescript-eslint/utils';

const messages = {
  USE_STANDARD_TYPE: 'Use correct type for injection token.',
  USE_INFERRED_TYPE: 'Use inferred type of injection token.',
  USE_INFERRED_TYPE_APPLY: 'Use inferred type with `{{expected}}`.',
};

const standardTokens = {
  APP_BASE_HREF: 'string',
  LOCALE_ID: 'string',
  DOCUMENT: 'Document',
};

const HAS_INJECT_DECORATOR = ':has(Decorator[expression.callee.name="Inject"])';

const useTypeSafeInjectionTokenRule: TSESLint.RuleModule<keyof typeof messages> = {
  defaultOptions: undefined,
  meta: {
    docs: {
      description:
        'Injection tokens in angular should inherit type information from the token itself to prevent using a wrong type where it is injected. By using `InjectSingle` or `InjectMultiple` the type of the token is inferred and can be used to type the injected value.',
      recommended: 'warn',
      url: '',
      suggestion: true,
    },
    messages,
    type: 'problem',
    schema: [],
    hasSuggestions: true,
  },
  create: context => ({
    [`TSParameterProperty${HAS_INJECT_DECORATOR},Identifier${HAS_INJECT_DECORATOR}`]: (
      node: TSESTree.TSParameterProperty | TSESTree.Identifier
    ) => {
      const injectDecorator = node.decorators.find(
        decorator =>
          decorator.expression?.type === TSESTree.AST_NODE_TYPES.CallExpression &&
          decorator.expression.callee?.type === TSESTree.AST_NODE_TYPES.Identifier &&
          decorator.expression.callee.name === 'Inject' &&
          decorator.expression.arguments.length === 1 &&
          decorator.expression.arguments[0].type === TSESTree.AST_NODE_TYPES.Identifier
      );
      if (injectDecorator) {
        const token = ((injectDecorator.expression as TSESTree.CallExpression).arguments[0] as TSESTree.Identifier)
          .name;

        const identifier = node.type === TSESTree.AST_NODE_TYPES.TSParameterProperty ? node.parameter : node;

        const typeText = context.getSourceCode().getText(identifier.typeAnnotation.typeAnnotation);

        if (standardTokens[token]) {
          const expected = standardTokens[token];

          if (typeText !== expected) {
            context.report({
              node: identifier,
              messageId: 'USE_STANDARD_TYPE',
              suggest: [
                {
                  fix: fixer => fixer.replaceTextRange(identifier.typeAnnotation.typeAnnotation.range, expected),
                  messageId: 'USE_STANDARD_TYPE',
                  data: { expected },
                },
              ],
            });
          }
        } else {
          const expectedSingle = `InjectSingle<typeof ${token}>`;
          const expectedMulti = `InjectMultiple<typeof ${token}>`;

          if (typeText !== expectedSingle && typeText !== expectedMulti) {
            context.report({
              node: identifier,
              messageId: 'USE_INFERRED_TYPE',
              suggest: [
                {
                  fix: fixer => fixer.replaceTextRange(identifier.typeAnnotation.typeAnnotation.range, expectedSingle),
                  messageId: 'USE_INFERRED_TYPE_APPLY',
                  data: { expected: expectedSingle },
                },
                {
                  fix: fixer => fixer.replaceTextRange(identifier.typeAnnotation.typeAnnotation.range, expectedMulti),
                  messageId: 'USE_INFERRED_TYPE_APPLY',
                  data: { expected: expectedMulti },
                },
              ],
            });
          }
        }
      }
    },
  }),
};

export default useTypeSafeInjectionTokenRule;
