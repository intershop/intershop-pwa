import { AST_NODE_TYPES } from '@typescript-eslint/utils';

import noReturnUndefinedRule from '../src/rules/no-return-undefined';

import testRule from './rule-tester';

testRule(noReturnUndefinedRule, {
  valid: [
    {
      name: 'should not report on empty return statements',
      filename: 'test.ts',
      code: `
        function testFunction() {
          return;
        }
        `,
    },
  ],
  invalid: [
    {
      name: 'should report if return statement returns undefined',
      filename: 'test.ts',
      code: `
        function testFunction() {
          return undefined;
        }
        `,
      output: `
        function testFunction() {
          return ;
        }
        `,
      errors: [
        {
          messageId: 'undefinedError',
          type: AST_NODE_TYPES.ReturnStatement,
        },
      ],
    },
  ],
});
