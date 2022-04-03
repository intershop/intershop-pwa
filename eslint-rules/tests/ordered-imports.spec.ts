import orderedImportsRule from '../src/rules/ordered-imports';

import testRule from './rule-tester';

const invalidTests: { code: string; output: string; name: string }[] = [
  {
    name: 'should sort regular imports',
    code: `
      import { d } from '@test/d';
      import { b } from '@test/b';
      import { c as a} from '@test/c';
      `,
    output: `
      import { b } from '@test/b';
      import { c as a } from '@test/c';
      import { d } from '@test/d';
      `,
  },
  {
    name: 'should sort imports with namespace or side effects',
    code: `
      import * as d from '@test/d';
      import def from '@default';
      import { b } from '@test/b';
      import '@sideeffect/init';
      `,
    output: `
      import def from '@default';
      import '@sideeffect/init';
      import { b } from '@test/b';
      import * as d from '@test/d';
    `,
  },
  {
    name: 'should sort imports in correct groups',
    code: `
      import { aa } from 'ish-aa';
      import { ab } from '@ab';
      import { d } from './d';
      import { c } from '../c';
      `,
    output: `
      import { ab } from '@ab';

      import { aa } from 'ish-aa';

      import { c } from '../c';

      import { d } from './d';
    `,
  },
  {
    name: 'should sort and order imports with groups',
    code: `
      import { bb } from 'ish-ab';
      import { aa } from 'ish-aa';
      import { d } from '@test/d';
      import { c } from '@test/c';
      `,
    output: `
      import { c } from '@test/c';
      import { d } from '@test/d';

      import { aa } from 'ish-aa';
      import { bb } from 'ish-ab';
    `,
  },
  {
    name: 'should sort named imports',
    code: `import { c, b, a } from '@test'`,
    output: `import { a, b, c } from '@test'`,
  },
  {
    name: 'should sort named imports using aliases',
    code: `import { xyz as a, b } from '@test'`,
    output: `import { b, xyz as a } from '@test'`,
  },
];

testRule(orderedImportsRule, {
  valid: [
    {
      name: 'should not report if imports are sorted and grouped correctly (complex)',
      filename: 'test.ts',
      code: formatter(`
          import { ab } from '@ab';
          import def from '@default';
          import '@sideeffect/init';
          import { bbb, xyz as a } from '@test';
          import { b } from '@test/b';
          import * as d from '@test/d';

          import { aa } from 'ish-aa';
          import { bb } from 'ish-bb';

          import { c, c1, c2 } from '../c';

          import { x } from './x';
        `),
    },
    {
      name: 'should not report if imports are sorted and grouped correctly (simple)',
      filename: 'test.ts',
      code: formatter(`

          import { ab } from '@ab';

          import { aa } from 'ish-aa';

          import { x } from './x';

        `),
    },
  ],
  /**
   * simplify tests:
   * - errors will always be on the same line starting at 1
   * - code is formatted so we can write it more easily
   */
  invalid: invalidTests.map(testConf => ({
    name: testConf.name,
    filename: 'test.ts',
    code: formatter(testConf.code),
    output: formatter(testConf.output),
    errors: [
      {
        line: 1,
        messageId: 'unorderedImports',
      },
    ],
  })),
});

/**
 * make formatting test code easier:
 *  - automatically remove leading whitespace per line (but not empty lines)
 *  - ignore trailing whitespace
 * => This rule is whitespace-sensitive so it would make the entire test very unreadable if we didn't do this preprocessing step
 */
function formatter(input: string): string {
  return input.replace(/^([^\S\r\n]*)(?=import.*\n)/gm, '').trim();
}
