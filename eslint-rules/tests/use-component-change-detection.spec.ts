import { AST_NODE_TYPES } from '@typescript-eslint/experimental-utils';

import { useComponentChangeDetectionRule } from '../src/rules/use-component-change-detection';

import { RuleTestConfig } from './_execute-tests';

const config: RuleTestConfig = {
  ruleName: 'use-component-change-detection',
  rule: useComponentChangeDetectionRule,
  tests: {
    valid: [
      {
        filename: 'test.service.ts',
        code: `
        @Injectable({})
        export class TestService {}
        `,
      },
      {
        filename: 'test.component.ts',
        code: `
        @Component({
          changeDetection: ChangeDetectionStrategy.OnPush
        })
        export class TestComponent {}
        `,
      },
    ],
    invalid: [
      {
        filename: 'test.component.ts',
        code: `
        @Component({})
        export class TestComponent {}
        `,
        errors: [
          {
            messageId: 'noChangeDetectionError',
            type: AST_NODE_TYPES.Decorator,
          },
        ],
      },
    ],
  },
};

export default config;
