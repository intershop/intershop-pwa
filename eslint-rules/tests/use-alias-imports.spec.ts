import { AST_NODE_TYPES } from '@typescript-eslint/utils';
import * as fs from 'fs';

import useAliasImportsRule from '../src/rules/use-alias-imports';

import testRule from './rule-tester';

jest.spyOn(fs, 'readFileSync').mockImplementation(
  () => `{
  "compilerOptions": {
    "paths": {
      "ish-shared/*": ["src/app/shared/*"]
    }
  }
}`
);

testRule(useAliasImportsRule, {
  valid: [
    {
      name: 'should not report if import already uses alias',
      filename: 'test/src/app/shared/test/test.component.ts',
      code: `
        import { SharedModule } from 'ish-shared/shared.module';
        `,
    },
    {
      name: 'should not report if import cannot be aliased',
      filename: 'test/src/app/foo/test/test.component.ts',
      code: `
        import { OtherModule } from '../../other.module';
        `,
    },
  ],
  invalid: [
    {
      name: 'should report if import could use alias',
      filename: 'test/src/app/shared/test/test.component.ts',
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
});
