import newlineBeforeRootMembersRule from '../src/rules/newline-before-root-members';

import testRule from './rule-tester';

testRule(newlineBeforeRootMembersRule, {
  valid: [
    {
      name: 'should not report on root members with proper newline usage',
      filename: 'test.ts',
      code: `
        const x = 10;

        x++;
        `,
    },
    {
      name: 'should not report on import statements',
      filename: 'test.ts',
      code: `
        import { bla } from '@bla';
        import { blub } from '@blub';

        const x = 10;
        `,
    },
    {
      name: 'should not report when export statements are properly separated',
      filename: 'test.ts',
      code: `
        import { bla } from '@bla';

        export { blub } from '@blub';
        export { blub2 } from '@blub2';
        `,
    },
    {
      name: 'should not report when export statements and star export statements are properly separated',
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
      name: 'should report when root members are not separated by newline',
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
      name: 'should report when imports and root members are not separated by newline',
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
      name: 'should report when import, export and normal statements are not separated by newline',
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
});
