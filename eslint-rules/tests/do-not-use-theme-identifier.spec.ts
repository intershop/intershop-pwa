import { doNotUseThemeIdentifierRule } from '../src/rules/do-not-use-theme-identifier';

import { RuleTestConfig } from './_execute-tests';

const config: RuleTestConfig<[string]> = {
  ruleName: 'do-not-use-theme-identifier',
  rule: doNotUseThemeIdentifierRule,
  tests: {
    valid: [
      {
        filename: 'test.component.spec.ts',
        code: `const theme = THEME;`,
      },
    ],
    invalid: [
      {
        filename: 'test.component.ts',
        code: `const theme = THEME;`,
        errors: [
          {
            messageId: 'doNotUseThemeIdentifier',
          },
        ],
      },
      {
        filename: 'test.pipe.ts',
        code: `const theme = THEME;`,
        errors: [
          {
            messageId: 'doNotUseThemeIdentifier',
          },
        ],
      },
      {
        filename: 'test.directive.ts',
        code: `const theme = THEME;`,
        errors: [
          {
            messageId: 'doNotUseThemeIdentifier',
          },
        ],
      },
      {
        filename: 'test.component.spec.ts',
        options: ['.*\\.ts'],
        code: `const theme = THEME;`,
        errors: [
          {
            messageId: 'doNotUseThemeIdentifier',
          },
        ],
      },
    ],
  },
};

export default config;
