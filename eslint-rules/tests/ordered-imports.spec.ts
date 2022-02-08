import { orderedImportsRule } from '../src/rules/ordered-imports';

import { RuleTestConfig } from './_execute-tests';

const invalidTests: { code: string; output: string }[] = [
  // standard sorting
  {
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
  // with namespace, default or sideeffect imports
  {
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
  // correct grouping
  {
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
  // grouping and sorting
  {
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
  // import member sorting
  {
    code: `import { c, b, a } from '@test'`,
    output: `import { a, b, c } from '@test'`,
  },
  // import member sorting with alias
  {
    code: `import { xyz as a, b } from '@test'`,
    output: `import { b, xyz as a } from '@test'`,
  },
];

const config: RuleTestConfig = {
  ruleName: 'ordered-imports',
  rule: orderedImportsRule,
  tests: {
    valid: [
      {
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
  },
};

/**
 * make formatting test code easier:
 *  - automatically remove leading whitespace per line (but not empty lines)
 *  - ignore trailing whitespace
 * => This rule is whitespace-sensitive so it would make the entire test very unreadable if we didn't do this preprocessing step
 */
function formatter(input: string): string {
  return input.replace(/^([^\S\r\n]*)(?=import.*\n)/gm, '').trim();
}

export default config;
