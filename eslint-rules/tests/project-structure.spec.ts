import { AST_NODE_TYPES } from '@typescript-eslint/utils';

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
          type: AST_NODE_TYPES.ExportNamedDeclaration,
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
          type: AST_NODE_TYPES.Identifier,
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
          type: AST_NODE_TYPES.Identifier,
          messageId: 'projectStructureError',
          data: {
            message: `'TestB2BComponent' is not in the correct file (expected '/src\\/test\\/test-b-2-b.component.ts$/')`,
          },
        },
      ],
    },
  ],
});
