import useSsrVariableInsteadOfPlatformIdRule from '../src/rules/use-ssr-variable-instead-of-platform-id';

import testRule from './rule-tester';

testRule(useSsrVariableInsteadOfPlatformIdRule, {
  valid: [],
  invalid: [
    {
      filename: 'file.ts',
      code: `if (isPlatformBrowser(this.platformId)) {}`,
      errors: [
        {
          messageId: 'useSsrVariableInsteadOfPlatformIdForBrowser',
          suggestions: [
            {
              messageId: 'useSsrVariableInsteadOfPlatformIdForBrowser',
              output: `if (!SSR) {}`,
            },
          ],
        },
      ],
    },
    {
      filename: 'file.ts',
      code: `if (isPlatformServer(this.platformId)) {}`,
      errors: [
        {
          messageId: 'useSsrVariableInsteadOfPlatformIdForServer',
          suggestions: [
            {
              messageId: 'useSsrVariableInsteadOfPlatformIdForServer',
              output: `if (SSR) {}`,
            },
          ],
        },
      ],
    },
  ],
});
