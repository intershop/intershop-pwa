import { AST_NODE_TYPES } from '@typescript-eslint/utils';

import sortTestbedMetadataArraysRule from '../src/rules/sort-testbed-metadata-arrays';

import { RuleTestConfig } from './_execute-tests';

const config: RuleTestConfig = {
  ruleName: 'sort-testbed-metadata-arrays',
  rule: sortTestbedMetadataArraysRule,
  tests: {
    valid: [
      {
        filename: 'test.component.spec.ts',
        code: `
          TestBed.configureTestingModule({
            imports: [A,B]
          })
        `,
      },
      {
        filename: 'test.component.spec.ts',
        code: `
          TestBed.configureTestingModule({
            imports: [
              MockComponent(A),
              MockComponent(B),
            ]
          })
        `,
      },
    ],
    invalid: [
      {
        filename: 'test.component.spec.ts',
        code: `
          TestBed.configureTestingModule({
            imports: [B,A]
          })
        `,
        errors: [
          {
            messageId: 'sortTestBedMetadataArrays',
            type: AST_NODE_TYPES.Identifier,
          },
        ],
        output: `
          TestBed.configureTestingModule({
            imports: [A,B]
          })
        `,
      },
      {
        filename: 'test.component.spec.ts',
        code: `
          TestBed.configureTestingModule({
            imports: [
              MockComponent(B),
              MockComponent(A),
            ]
          })
        `,
        errors: [
          {
            messageId: 'sortTestBedMetadataArrays',
            type: AST_NODE_TYPES.CallExpression,
          },
        ],
        output: `
          TestBed.configureTestingModule({
            imports: [
              MockComponent(A),
              MockComponent(B),
            ]
          })
        `,
      },
    ],
  },
};

export default config;
