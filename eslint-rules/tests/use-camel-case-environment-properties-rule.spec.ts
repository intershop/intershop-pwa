import { AST_NODE_TYPES } from '@typescript-eslint/utils';

import useCamelCaseEnvironmentPropertiesRule from '../src/rules/use-camel-case-environment-properties';

import testRule from './rule-tester';

testRule(useCamelCaseEnvironmentPropertiesRule, {
  valid: [
    {
      name: 'should not report on files other than environment',
      filename: 'src/test.component.ts',
      code: `
        @Component({})
        export class TestComponent {
          Some_identifier: string;
        }
        `,
    },
    {
      name: 'should not report if proper camel casing is used',
      filename: 'src/environment.test.ts',
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
      name: 'should report if proper camel casing is not used',
      filename: 'src/environment.test.ts',
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
});
