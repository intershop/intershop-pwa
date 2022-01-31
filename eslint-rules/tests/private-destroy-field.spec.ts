import { AST_NODE_TYPES } from '@typescript-eslint/experimental-utils';

import { privateDestroyFieldRule } from '../src/rules/private-destroy-field';

import { RuleTestConfig } from './_execute-tests';

const config: RuleTestConfig = {
  ruleName: 'private-destroy-field',
  rule: privateDestroyFieldRule,
  tests: {
    valid: [
      {
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
  },
};

export default config;
