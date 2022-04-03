import { AST_NODE_TYPES } from '@typescript-eslint/utils';

import useComponentChangeDetectionRule from '../src/rules/use-component-change-detection';

import testRule from './rule-tester';

testRule(useComponentChangeDetectionRule, {
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
});
