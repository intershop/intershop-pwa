import projectStructureRule from '../src/rules/project-structure';

import testRule from './rule-tester';

const options = {
  reusePatterns: {
    name: '[a-z][a-z0-9]*(?:-[a-z][a-z0-9]*)*',
    theme: '(?:\\.(?:foo|bar))*',
  },
  pathPatterns: ['^.*/src/test/foo(\\.\\w+)?\\.ts$', '^.*src/test/[\\s\\S]*.ts$'],
  patterns: [
    {
      name: '^(TestComponent)$',
      file: '.*src/test/test.component(<theme>)?\\.ts$',
    },
  ],
  ignoredFiles: ['foo.ts$'],
};

const guardPatterns = [
  {
    name: '^([a-z].*)Guard$',
    file: '.*/src/test/<kebab>\\.guard\\.ts$',
  },
];

testRule(projectStructureRule, {
  valid: [
    {
      name: 'should not report if file is ignored',
      options: [options],
      filename: 'path/src/baz/whatever/foo.ts',
      code: `
        @Component({})
        export class FooComponent {
        }
        `,
    },
    {
      name: 'should not report if file is expected and contains the correct artifacts',
      options: [{ ...options, warnUnmatched: true }],
      filename: 'path/src/test/test.component.ts',
      code: `
        @Component({})
        export class TestComponent {
        }
        `,
    },
    {
      name: 'should not report as long as kebab conversion works correctly',
      options: [
        {
          ...options,
          pathPatterns: ['^.*/src/pages/foo-bar/foo-bar-page.component.ts$'],
          patterns: [
            {
              name: '^([A-Z].*)PageComponent$',
              file: '.*/pages/<kebab>/<kebab>-page\\.component(<theme>)?\\.ts$',
            },
          ],
        },
      ],
      filename: 'path/src/pages/foo-bar/foo-bar-page.component.ts',
      code: `
        @Component({})
        export class FooBarPageComponent {
        }
        `,
    },
    {
      name: 'should not report as long as kebab conversion with allowed number words works correctly',
      options: [
        {
          ...options,
          patterns: [
            {
              name: '^([A-Z].*)Component$',
              file: 'src/test/<kebab>.component.ts$',
            },
          ],
          allowedNumberWords: ['b2b'],
        },
      ],
      filename: 'src/test/test-b2b.component.ts',
      code: `
        @Component({})
        export class TestB2BComponent {
        }
        `,
    },
    {
      name: 'should not report if an exported constant is in the correct file',
      options: [{ ...options, patterns: guardPatterns }],
      filename: 'path/src/test/foo-bar.guard.ts',
      code: `
        export const fooBarGuard = () => true;
        `,
    },
    {
      name: 'should not report if an exported function is in the correct file',
      options: [{ ...options, patterns: guardPatterns }],
      filename: 'path/src/test/foo-bar.guard.ts',
      code: `
        export function fooBarGuard() {
          return true;
        }
        `,
    },
    {
      name: 'should not report unmatched exported functions and constants with warnUnmatched',
      options: [{ ...options, patterns: guardPatterns, warnUnmatched: true }],
      filename: 'path/src/test/test.component.ts',
      code: `
        export const someHelper = () => true;
        export function otherHelper() {}
        `,
    },
    {
      name: 'should not report constants that are not exported',
      options: [{ ...options, patterns: guardPatterns }],
      filename: 'path/src/test/test.component.ts',
      code: `
        const fooBarGuard = () => true;
        `,
    },
  ],
  invalid: [
    {
      name: 'should report if artifact is not in the right file',
      options: [options],
      filename: 'path/src/test/bar.ts',
      code: `
        @Component({})
        export class TestComponent {
        }
        `,
      errors: [
        {
          messageId: 'projectStructureError',
          data: {
            message: `'TestComponent' is not in the correct file (expected '/.*src\\/test\\/test.component((?:\\.(?:foo|bar))*)?\\.ts$/')`,
          },
        },
      ],
    },
    {
      name: 'should report if file is not expected',
      options: [options],
      filename: 'path/baz/test.component.ts',
      code: `
        @Component({})
        export class TestFooComponent {
        }
        `,
      errors: [
        {
          messageId: 'projectStructureError',
          data: {
            message: 'path/baz/test.component.ts this file path does not match any defined patterns.',
          },
        },
      ],
    },
    {
      name: 'should report if artifact is not expected and warnUnmatched is true',
      options: [{ ...options, warnUnmatched: true }],
      filename: 'path/src/test/test.component.bar.ts',
      code: `
        @Component({})
        export class TestFooComponent {
        }
        `,
      errors: [
        {
          messageId: 'projectStructureError',
          data: {
            message: 'no pattern match for TestFooComponent in file path/src/test/test.component.bar.ts',
          },
        },
      ],
    },
    {
      name: 'should report if artifact is not correctly named considering number word kebab casing',
      options: [
        {
          ...options,
          patterns: [
            {
              name: '^([A-Z].*)Component$',
              file: 'src/test/<kebab>.component.ts$',
            },
          ],
        },
      ],
      filename: 'src/test/test-b2b.component.ts',
      code: `
        @Component({})
        export class TestB2BComponent {
        }
        `,
      errors: [
        {
          messageId: 'projectStructureError',
          data: {
            message: `'TestB2BComponent' is not in the correct file (expected '/src\\/test\\/test-b-2-b.component.ts$/')`,
          },
        },
      ],
    },
    {
      name: 'should report if an exported constant is not in the right file',
      options: [{ ...options, patterns: guardPatterns }],
      filename: 'path/src/test/test.component.ts',
      code: `
        export const fooBarGuard = () => true;
        `,
      errors: [
        {
          messageId: 'projectStructureError',
          data: {
            message: `'fooBarGuard' is not in the correct file (expected '/.*\\/src\\/test\\/foo-bar\\.guard\\.ts$/')`,
          },
        },
      ],
    },
    {
      name: 'should report if an exported function is not in the right file',
      options: [{ ...options, patterns: guardPatterns }],
      filename: 'path/src/test/test.component.ts',
      code: `
        export function fooBarGuard() {
          return true;
        }
        `,
      errors: [
        {
          messageId: 'projectStructureError',
          data: {
            message: `'fooBarGuard' is not in the correct file (expected '/.*\\/src\\/test\\/foo-bar\\.guard\\.ts$/')`,
          },
        },
      ],
    },
  ],
});
