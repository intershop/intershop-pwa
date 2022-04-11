import { AST_NODE_TYPES } from '@typescript-eslint/utils';

import noStarImportsInStoreRule from '../src/rules/no-star-imports-in-store';

import testRule from './rule-tester';

const starImportTest: {
  code: string;
  output: string;
  errors: { messageId: 'starImportError'; type: AST_NODE_TYPES }[];
} = {
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

testRule(noStarImportsInStoreRule, {
  valid: [
    {
      name: 'should not report on star imports outside of store',
      filename: 'test.component.ts',
      code: starImportTest.code,
    },
    {
      name: 'should not report if there is no star import',
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
      name: 'should report if there is a star import in effects',
      filename: 'test.effects.ts',
      code: starImportTest.code,
      output: starImportTest.output,
      errors: starImportTest.errors,
    },
    {
      name: 'should report if there is a star import in reducers',
      filename: 'test.reducer.ts',
      code: starImportTest.code,
      output: starImportTest.output,
      errors: starImportTest.errors,
    },
    {
      name: 'should report if there is a star import in actions',
      filename: 'test.actions.ts',
      code: starImportTest.code,
      output: starImportTest.output,
      errors: starImportTest.errors,
    },
    {
      name: 'should report if there is a star import in selectors',
      filename: 'test.selectors.ts',
      code: starImportTest.code,
      output: starImportTest.output,
      errors: starImportTest.errors,
    },
  ],
});
