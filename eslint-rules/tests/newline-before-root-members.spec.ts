import { newlineBeforeRootMembersRule } from '../src/rules/newline-before-root-members';

import { RuleTestConfig } from './_execute-tests';

const config: RuleTestConfig = {
  ruleName: 'newline-before-root-members',
  rule: newlineBeforeRootMembersRule,
  tests: {
    valid: [
      {
        filename: 'test.ts',
        code: `
        const x = 10;

        x++;
        `,
      },
      {
        filename: 'test.ts',
        code: `
        import { bla } from '@bla';
        import { blub } from '@blub';

        const x = 10;
        `,
      },
      {
        filename: 'test.ts',
        code: `
        import { bla } from '@bla';

        export { blub } from '@blub';
        export { blub2 } from '@blub2';
        `,
      },
      {
        filename: 'test.ts',
        code: `
        import { bla } from '@bla';

        export { blub } from '@blub';

        export * from './blub2';
        export * from './blub3';
        `,
      },
    ],
    invalid: [
      {
        filename: 'test.ts',
        code: `
        const x = 10;
        x++;
        `,
        errors: [
          {
            messageId: 'newLineBeforeRootMembers',
          },
        ],
        output: `
        const x = 10;

        x++;
        `,
      },
      {
        filename: 'test.ts',
        code: `
        import { Component } from '@angular';
        @Component({})
        export class TestComponent {}
        `,
        errors: [
          {
            messageId: 'newLineBeforeRootMembers',
          },
        ],
        output: `
        import { Component } from '@angular';

        @Component({})
        export class TestComponent {}
        `,
      },
      {
        filename: 'test.ts',
        code: `
        import { Component } from '@angular';
        normalCode();
        export { TestExport } from 'test';
        `,
        errors: [
          {
            messageId: 'newLineBeforeRootMembers',
          },
          {
            messageId: 'newLineBeforeRootMembers',
          },
        ],
        output: `
        import { Component } from '@angular';

        normalCode();

        export { TestExport } from 'test';
        `,
      },
    ],
  },
};

export default config;
