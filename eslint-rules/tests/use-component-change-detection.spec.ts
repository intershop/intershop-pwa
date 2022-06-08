import { AST_NODE_TYPES } from '@typescript-eslint/utils';

import useComponentChangeDetectionRule from '../src/rules/use-component-change-detection';

import testRule from './rule-tester';

testRule(useComponentChangeDetectionRule, {
  valid: [
    {
      name: 'should not report on non-component files',
      filename: 'test.service.ts',
      code: `
        @Injectable({})
        export class TestService {}
        `,
    },
    {
      name: 'should not report if component change detection is used',
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
      name: 'should report if component change detection is not used',
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
