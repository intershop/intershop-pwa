import doNotUseThemeIdentifierRule from '../src/rules/do-not-use-theme-identifier';

import testRule from './rule-tester';

testRule(doNotUseThemeIdentifierRule, {
  valid: [
    {
      name: 'should not report on theme identifier in tests by default',
      filename: 'test.component.spec.ts',
      code: `const theme = THEME;`,
    },
  ],
  invalid: [
    {
      name: 'should report on theme identifier in components',
      filename: 'test.component.ts',
      code: `const theme = THEME;`,
      errors: [
        {
          messageId: 'doNotUseThemeIdentifier',
        },
      ],
    },
    {
      name: 'should report on theme identifier in pipes',
      filename: 'test.pipe.ts',
      code: `const theme = THEME;`,
      errors: [
        {
          messageId: 'doNotUseThemeIdentifier',
        },
      ],
    },
    {
      name: 'should report on theme identifier in directives',
      filename: 'test.directive.ts',
      code: `const theme = THEME;`,
      errors: [
        {
          messageId: 'doNotUseThemeIdentifier',
        },
      ],
    },
    {
      name: 'should report on theme identifier in tests when configured',
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
});
