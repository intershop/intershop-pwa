import { AST_NODE_TYPES } from '@typescript-eslint/experimental-utils';

import { noTestbedWithThenRule } from '../src/rules/no-testbed-with-then';

import { RuleTestConfig } from './_execute-tests';

const config: RuleTestConfig = {
  ruleName: 'no-testbed-with-then',
  rule: noTestbedWithThenRule,
  tests: {
    valid: [
      {
        filename: 'demo.component.spec.ts',
        code: `
        beforeEach(() => {
          TestBed.configureTestingModule({});
        });
        `,
      },
      {
        filename: 'demo.component.ts',
        code: ``,
      },
    ],
    invalid: [
      {
        filename: 'demo.component.spec.ts',
        code: `
        beforeEach(() => {
          TestBed.configureTestingModule({});
        }).then(() => {});
        `,
        errors: [
          {
            type: AST_NODE_TYPES.Identifier,
            messageId: 'testbedWithThenError',
          },
        ],
      },
    ],
  },
};

export default config;
