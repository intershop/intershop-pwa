import { AST_NODE_TYPES } from '@typescript-eslint/experimental-utils';

import { noObjectLiteralTypeAssertionRule } from '../src/rules/no-object-literal-type-assertion';

import { RuleTestConfig } from './_execute-tests';

const config: RuleTestConfig = {
  ruleName: 'no-object-literal-type-assertion',
  rule: noObjectLiteralTypeAssertionRule,
  tests: {
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
  },
};

export default config;
