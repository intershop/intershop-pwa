import { AST_NODE_TYPES } from '@typescript-eslint/utils';

import useJestExtendedMatchersInTestsRule from '../src/rules/use-jest-extended-matchers-in-tests';

import testRule from './rule-tester';

testRule(useJestExtendedMatchersInTestsRule, {
  valid: [
    {
      name: 'should not report if toBeFalse is used correctly',
      filename: 'test.spec.ts',
      code: `expect(variable).toBeFalse()`,
    },
    {
      name: 'should not report if toBeTrue is used correctly',
      filename: 'test.spec.ts',
      code: `expect(variable).toBeTrue()`,
    },
    {
      name: 'should not report if toBeUndefined is used correctly',
      filename: 'test.spec.ts',
      code: `expect(variable).toBeUndefined()`,
    },
    {
      name: 'should not report if toBeEmpty is used correctly',
      filename: 'test.spec.ts',
      code: `expect(variable).toBeEmpty()`,
    },
    {
      name: 'should not report if toHaveLength is used correctly',
      filename: 'test.spec.ts',
      code: `expect(arr).toHaveLength(2)`,
    },
    {
      name: 'should not report if toBeNan is used correctly',
      filename: 'test.spec.ts',
      code: `expect(variable).toBeNan()`,
    },
  ],
  invalid: [
    {
      name: 'should report if additional pattern is supplied as option',
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
    {
      name: 'should replace toEqual(false) with toBeFalse()',
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
      name: 'should replace toEqual(true) with toBeTrue()',
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
      name: 'should replace toEqual(undefined) with toBeUndefined()',
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
      name: "should replace toEqual('') with toBeEmpty()",
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
      name: 'should replace toEqual([]) with toBeEmpty()',
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
      name: 'should replace toEqual({}) with toBeEmpty()',
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
      name: 'should replace length).toEqual(Num) with toHaveLength(Num)',
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
      name: 'should replace toEqual(NaN) with toBeNan()',
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
});
