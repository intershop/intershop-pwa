import useAliasImportsRule from '../src/rules/use-alias-imports';

import testRule from './rule-tester';

jest.mock('fs', () => ({
  ...jest.requireActual('fs'),
  readFileSync: jest.fn(
    () => `{
  "compilerOptions": {
    "paths": {
      "ish-shared/*": ["src/app/shared/*"]
    }
  }
}`
  ),
}));

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
    {
      name: 'should not report local imports inside the aliased folder',
      filename: 'test/src/app/shared/test/test.component.ts',
      code: `
        import { OtherComponent } from './other.component';
        import { otherAction } from '.';
        `,
    },
    {
      name: 'should not report src imports without alias',
      filename: 'test/src/app/shared/test/test.component.ts',
      code: `
        import { CaptchaExportsModule } from 'src/app/extensions/captcha/exports/captcha-exports.module';
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
        },
      ],
      output: `
        import { SharedModule } from 'ish-shared/shared.module';
        `,
    },
    {
      name: 'should report if src import could use alias',
      filename: 'test/src/app/foo/test/test.component.ts',
      code: `
        import { SharedModule } from 'src/app/shared/shared.module';
        `,
      errors: [
        {
          messageId: 'noAlias',
          data: { alias: 'ish-shared/' },
        },
      ],
      output: `
        import { SharedModule } from 'ish-shared/shared.module';
        `,
    },
    {
      name: 'should report if local import leads into the aliased folder',
      filename: 'test/src/app/app.module.ts',
      code: `
        import { SharedModule } from './shared/shared.module';
        `,
      errors: [
        {
          messageId: 'noAlias',
          data: { alias: 'ish-shared/' },
        },
      ],
      output: `
        import { SharedModule } from 'ish-shared/shared.module';
        `,
    },
  ],
});
