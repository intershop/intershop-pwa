import { TSESLint } from '@typescript-eslint/utils';

/**
 * Disallows `isPlatformBrowser` and `isPlatformServer` with the injected `PLATFORM_ID`.
 * Use the `SSR` variable provided by the Intershop PWA instead:
 *
 * `isPlatformBrowser(this.platformId)` becomes `!SSR`, `isPlatformServer(this.platformId)` becomes `SSR`
 */
const useSsrVariableInsteadOfPlatformIdRule: TSESLint.RuleModule<string> = {
  meta: {
    docs: {
      description:
        'Instead of using `isPlatformBrowser` and `isPlatformServer` together with the injected `PLATFORM_ID`, the Intershop PWA provides a `SSR` variable that can be used for this.',
      url: '',
    },
    messages: {
      useSsrVariableInsteadOfPlatformIdForBrowser: 'Use the expression !SSR instead.',
      useSsrVariableInsteadOfPlatformIdForServer: 'Use the variable SSR instead.',
    },
    type: 'problem',
    schema: [],
    fixable: 'code',
    hasSuggestions: true,
  },
  create: context => ({
    'CallExpression[callee.name=isPlatformBrowser]'(node) {
      context.report({
        messageId: 'useSsrVariableInsteadOfPlatformIdForBrowser',
        node,
        suggest: [
          { fix: fixer => fixer.replaceText(node, '!SSR'), messageId: 'useSsrVariableInsteadOfPlatformIdForBrowser' },
        ],
      });
    },
    'CallExpression[callee.name=isPlatformServer]'(node) {
      context.report({
        messageId: 'useSsrVariableInsteadOfPlatformIdForServer',
        node,
        suggest: [
          { fix: fixer => fixer.replaceText(node, 'SSR'), messageId: 'useSsrVariableInsteadOfPlatformIdForServer' },
        ],
      });
    },
  }),
};

export default useSsrVariableInsteadOfPlatformIdRule;
