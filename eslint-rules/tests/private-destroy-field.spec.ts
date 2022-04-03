import { AST_NODE_TYPES } from '@typescript-eslint/utils';

import privateDestroyFieldRule from '../src/rules/private-destroy-field';

import testRule from './rule-tester';

testRule(privateDestroyFieldRule, {
  valid: [
    {
      name: 'should not report if destroy$ subject is initialized correctly',
      filename: 'test.component.ts',
      code: `
        @Component({})
        export class TestComponent  {
          private destroy$ = new Subject<any>();
        }
        `,
    },
  ],
  invalid: [
    {
      name: 'should report if destroy$ subject is implicitely public',
      filename: 'test.component.ts',
      code: `
        @Component({})
        export class TestComponent  {
          destroy$ = new Subject<any>();
        }
        `,
      errors: [
        {
          messageId: 'privateDestroyError',
          type: AST_NODE_TYPES.PropertyDefinition,
        },
      ],
      output: `
        @Component({})
        export class TestComponent  {
          private destroy$ = new Subject<any>();
        }
        `,
    },
    {
      name: 'should report if destroy$ subject is explicitely public',
      filename: 'test.component.ts',
      code: `
        @Component({})
        export class TestComponent  {
          public destroy$ = new Subject<any>();
        }
        `,
      errors: [
        {
          messageId: 'privateDestroyError',
          type: AST_NODE_TYPES.PropertyDefinition,
        },
      ],
      output: `
        @Component({})
        export class TestComponent  {
          private destroy$ = new Subject<any>();
        }
        `,
    },
  ],
});
