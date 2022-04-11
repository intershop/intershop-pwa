import { AST_NODE_TYPES } from '@typescript-eslint/utils';

import noObjectLiteralTypeAssertionRule from '../src/rules/no-object-literal-type-assertion';

import testRule from './rule-tester';

testRule(noObjectLiteralTypeAssertionRule, {
  valid: [
    {
      name: 'should not report if there are no object literal type assertions',
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
      name: 'should report if there is an object literal type assertion',
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
