import { AST_NODE_TYPES } from '@typescript-eslint/experimental-utils';

import { useJestExtendedMatchersInTestsRule } from '../src/rules/use-jest-extended-matchers-in-tests';

import { RuleTestConfig } from './_execute-tests';

const config: RuleTestConfig = {
  ruleName: 'use-jest-extended-matchers-in-tests',
  rule: useJestExtendedMatchersInTestsRule,
  tests: {
    valid: [
      {
        filename: 'test.spec.ts',
        code: `expect(variable).toBeFalse()`,
      },
      {
        filename: 'test.spec.ts',
        code: `expect(variable).toBeTrue()`,
      },
      {
        filename: 'test.spec.ts',
        code: `expect(variable).toBeUndefined()`,
      },
      {
        filename: 'test.spec.ts',
        code: `expect(variable).toBeEmpty()`,
      },
      {
        filename: 'test.spec.ts',
        code: `expect(arr).toHaveLength(2)`,
      },
      {
        filename: 'test.spec.ts',
        code: `expect(variable).toBeNan()`,
      },
    ],
    invalid: [
      // Test additional option pattern
      {
        filename: 'test.spec.ts',
        options: [
          [
            {
              pattern: '(toBe|toEqual)\\(null\\)$',
              replacement: 'toBeNull()',
              text: 'toBeNull',
            },
          ],
        ],
        code: `expect(variable).toEqual(null)`,
        errors: [
          {
            messageId: 'alternative',
            data: {
              alternative: 'toBeNull',
            },
            type: AST_NODE_TYPES.Identifier,
          },
        ],
        output: `expect(variable).toBeNull()`,
      },
      // Test default patterns
      {
        filename: 'test.spec.ts',
        code: `expect(variable).toEqual(false)`,
        errors: [
          {
            messageId: 'alternative',
            data: {
              alternative: 'toBeFalse',
            },
            type: AST_NODE_TYPES.Identifier,
          },
        ],
        output: `expect(variable).toBeFalse()`,
      },
      {
        filename: 'test.spec.ts',
        code: `expect(variable).toEqual(true)`,
        errors: [
          {
            messageId: 'alternative',
            data: {
              alternative: 'toBeTrue',
            },
            type: AST_NODE_TYPES.Identifier,
          },
        ],
        output: `expect(variable).toBeTrue()`,
      },
      {
        filename: 'test.spec.ts',
        code: `expect(variable).toEqual(undefined)`,
        errors: [
          {
            messageId: 'alternative',
            data: {
              alternative: 'toBeUndefined',
            },
            type: AST_NODE_TYPES.Identifier,
          },
        ],
        output: `expect(variable).toBeUndefined()`,
      },
      {
        filename: 'test.spec.ts',
        code: `expect(variable).toEqual('')`,
        errors: [
          {
            messageId: 'alternative',
            data: {
              alternative: 'toBeEmpty',
            },
            type: AST_NODE_TYPES.Identifier,
          },
        ],
        output: `expect(variable).toBeEmpty()`,
      },
      {
        filename: 'test.spec.ts',
        code: `expect(variable).toEqual([])`,
        errors: [
          {
            messageId: 'alternative',
            data: {
              alternative: 'toBeEmpty',
            },
            type: AST_NODE_TYPES.Identifier,
          },
        ],
        output: `expect(variable).toBeEmpty()`,
      },
      {
        filename: 'test.spec.ts',
        code: `expect(variable).toEqual({})`,
        errors: [
          {
            messageId: 'alternative',
            data: {
              alternative: 'toBeEmpty',
            },
            type: AST_NODE_TYPES.Identifier,
          },
        ],
        output: `expect(variable).toBeEmpty()`,
      },
      {
        filename: 'test.spec.ts',
        code: `expect(arr.length).toEqual(2)`,
        errors: [
          {
            messageId: 'alternative',
            data: {
              alternative: 'toHaveLength',
            },
            type: AST_NODE_TYPES.Identifier,
          },
        ],
        output: `expect(arr).toHaveLength(2)`,
      },
      {
        filename: 'test.spec.ts',
        code: `expect(variable).toEqual(NaN)`,
        errors: [
          {
            messageId: 'alternative',
            data: {
              alternative: 'toBeNaN',
            },
            type: AST_NODE_TYPES.Identifier,
          },
        ],
        output: `expect(variable).toBeNaN()`,
      },
    ],
  },
};

export default config;
