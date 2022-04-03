import { AST_NODE_TYPES } from '@typescript-eslint/utils';

import noTestbedWithThenRule from '../src/rules/no-testbed-with-then';

import testRule from './rule-tester';

testRule(noTestbedWithThenRule, {
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
});
