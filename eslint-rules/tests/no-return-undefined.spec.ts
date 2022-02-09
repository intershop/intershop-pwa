import { AST_NODE_TYPES } from '@typescript-eslint/experimental-utils';

import { noReturnUndefinedRule } from '../src/rules/no-return-undefined';

import { RuleTestConfig } from './_execute-tests';

const config: RuleTestConfig = {
  ruleName: 'no-return-undefined',
  rule: noReturnUndefinedRule,
  tests: {
    valid: [
      {
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
  },
};

export default config;
