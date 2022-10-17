import { AST_NODE_TYPES } from '@typescript-eslint/utils';

import banImportsFilePatternRule from '../src/rules/ban-imports-file-pattern';

import testRule from './rule-tester';

testRule(banImportsFilePatternRule, {
  valid: [
    {
      name: 'should not report on file not included in file pattern',
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
      name: 'should report on file included in file pattern',
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
      name: 'should report on file included in file pattern',
      filename: 'test.component.spec.ts',
      options: [
        [
          {
            importNamePattern: 'environment',
            name: '.*environments\\/environment',
            filePattern: '^.*\\.ts$',
            message: 'Test Message',
          },
        ],
      ],
      code: `
        import { environment } from '../environments/environment';
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
      name: 'should report when detecting disallowed star pattern',
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
});
