import { AST_NODE_TYPES } from '@typescript-eslint/utils';

import banImportsFilePatternRule, { RuleSetting } from '../src/rules/ban-imports-file-pattern';

import { RuleTestConfig } from './_execute-tests';

const config: RuleTestConfig<[RuleSetting[]]> = {
  rule: banImportsFilePatternRule,
  tests: {
    valid: [
      {
        filename: 'test.component.ts',
        options: [
          [
            {
              importNamePattern: 'foo|bar|baz',
              name: '@foobar',
              filePattern: '^.*\\.spec\\.ts*$',
              message: 'Test Message',
            },
          ],
        ],
        code: `
        import { foo } from '@foobar'
      `,
      },
    ],
    invalid: [
      {
        filename: 'test.component.spec.ts',
        options: [
          [
            {
              importNamePattern: 'foo|bar|baz',
              name: '@foobar',
              filePattern: '^.*\\.spec\\.ts*$',
              message: 'Test Message',
            },
          ],
        ],
        code: `
        import { foo } from '@foobar'
      `,
        errors: [
          {
            messageId: 'banImportsFilePatternError',
            data: {
              message: 'Test Message',
            },
            type: AST_NODE_TYPES.ImportDeclaration,
          },
        ],
      },
      {
        filename: 'test.component.ts',
        options: [
          [
            {
              starImport: true,
              name: 'foobar',
              filePattern: '^.*\\.component\\.ts*$',
              message: 'Test Star Import.',
            },
          ],
        ],
        code: `
        import * as foo from 'foobar'
      `,
        errors: [
          {
            messageId: 'banImportsFilePatternError',
            data: {
              message: 'Test Star Import.',
            },
            type: AST_NODE_TYPES.ImportDeclaration,
          },
        ],
      },
    ],
  },
};

export default config;
