import { AST_NODE_TYPES } from '@typescript-eslint/experimental-utils';

import { useCamelCaseEnvironmentPropertiesRule } from '../src/rules/use-camel-case-environment-properties';

import { RuleTestConfig } from './_execute-tests';

const config: RuleTestConfig = {
  ruleName: 'use-camel-case-environment-properties-rule',
  rule: useCamelCaseEnvironmentPropertiesRule,
  tests: {
    valid: [
      {
        filename: 'src/test.component.ts',
        code: `
        @Component({})
        export class TestComponent {
          Some_identifier: string;
        }
        `,
      },
      {
        filename: 'src\\environment.test.ts',
        code: `
        export interface environment {
          someIdentifier: string;
          other: string[];
        }
        `,
      },
    ],
    invalid: [
      {
        filename: 'src\\environment.test.ts',
        code: `
        export interface environment {
          SomeIdentifier: string;
          other_indetifier: string;
          Some_longer_identifier_With_multiple_errors: string;
        }
        `,
        errors: [
          {
            messageId: 'camelCaseError',
            data: { property: 'SomeIdentifier' },
            type: AST_NODE_TYPES.Identifier,
          },
          {
            messageId: 'camelCaseError',
            data: { property: 'other_indetifier' },
            type: AST_NODE_TYPES.Identifier,
          },
          {
            messageId: 'camelCaseError',
            data: { property: 'Some_longer_identifier_With_multiple_errors' },
            type: AST_NODE_TYPES.Identifier,
          },
        ],
        output: `
        export interface environment {
          someIdentifier: string;
          otherIndetifier: string;
          someLongerIdentifierWithMultipleErrors: string;
        }
        `,
      },
    ],
  },
};

export default config;
