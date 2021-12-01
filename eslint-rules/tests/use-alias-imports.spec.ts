import { AST_NODE_TYPES } from '@typescript-eslint/experimental-utils';

import { useAliasImportsRule } from '../src/rules/use-alias-imports';

import { RuleTestConfig } from './_execute-tests';

// Attention: This test is an integration test. Results can be influenced by changes in ./tsconfig.json
const config: RuleTestConfig = {
  ruleName: 'use-alias-imports',
  rule: useAliasImportsRule,
  tests: {
    valid: [
      {
        filename: 'test\\src\\app\\shared\\test\\test.component.ts',
        code: `
        import { SharedModule } from 'ish-shared/shared.module';
        `,
      },
      {
        filename: 'test\\src\\app\\foo\\test\\test.component.ts',
        code: `
        import { SharedModule } from '../../shared.module';
        `,
      },
    ],
    invalid: [
      {
        filename: 'test\\src\\app\\shared\\test\\test.component.ts',
        code: `
        import { SharedModule } from '../shared.module';
        `,
        errors: [
          {
            messageId: 'noAlias',
            data: { alias: 'ish-shared/' },
            type: AST_NODE_TYPES.ImportDeclaration,
          },
        ],
        output: `
        import { SharedModule } from 'ish-shared/shared.module';
        `,
      },
    ],
  },
};

export default config;
