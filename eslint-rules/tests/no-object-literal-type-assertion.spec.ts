import { AST_NODE_TYPES } from '@typescript-eslint/utils';

import noObjectLiteralTypeAssertionRule from '../src/rules/no-object-literal-type-assertion';

import testRule from './rule-tester';

testRule(noObjectLiteralTypeAssertionRule, {
  valid: [
    {
      filename: 'test.ts',
      code: `
        interface Test {
          foo: string;
        }
        const bar: Test;
        `,
    },
  ],
  invalid: [
    {
      filename: 'test.ts',
      code: `
        interface Test {
          foo: string;
        }
        return {} as Test;
        `,
      errors: [
        {
          messageId: 'noObjectLiteralTypeAssertionError',
          type: AST_NODE_TYPES.TSAsExpression,
        },
      ],
    },
  ],
});
