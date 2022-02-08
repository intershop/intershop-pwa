import { AST_NODE_TYPES } from '@typescript-eslint/experimental-utils';

import { noStarImportsInStoreRule } from '../src/rules/no-star-imports-in-store';

import { RuleTestConfig } from './_execute-tests';

const starImportTest: { code: string; output: string; errors: { messageId: string; type: AST_NODE_TYPES }[] } = {
  code: `
    import * as test from 'foo';

        @Injectable({})
        export class TestEffect {
          const a = test.bar;
        }
    `,
  output: `
    import { bar } from 'foo'

        @Injectable({})
        export class TestEffect {
          const a = bar;
        }
    `,
  errors: [
    {
      messageId: 'starImportError',
      type: AST_NODE_TYPES.ImportDeclaration,
    },
    {
      messageId: 'starImportError',
      type: AST_NODE_TYPES.MemberExpression,
    },
  ],
};

const config: RuleTestConfig = {
  ruleName: 'no-star-imports-in-store',
  rule: noStarImportsInStoreRule,
  tests: {
    valid: [
      {
        filename: 'test.component.ts',
        code: starImportTest.code,
      },
      {
        filename: 'test.effects.ts',
        code: `
        import { Store } from '@ngrx';

        @Injectable({})
        export class TestEffect {
        }
        `,
      },
    ],
    invalid: [
      {
        filename: 'test.effects.ts',
        code: starImportTest.code,
        output: starImportTest.output,
        errors: starImportTest.errors,
      },
      {
        filename: 'test.reducer.ts',
        code: starImportTest.code,
        output: starImportTest.output,
        errors: starImportTest.errors,
      },
      {
        filename: 'test.actions.ts',
        code: starImportTest.code,
        output: starImportTest.output,
        errors: starImportTest.errors,
      },
      {
        filename: 'test.selectors.ts',
        code: starImportTest.code,
        output: starImportTest.output,
        errors: starImportTest.errors,
      },
    ],
  },
};

export default config;
