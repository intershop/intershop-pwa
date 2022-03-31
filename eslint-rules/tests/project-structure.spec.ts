import { AST_NODE_TYPES } from '@typescript-eslint/utils';

import { projectStructureRule } from '../src/rules/project-structure';

import { RuleTestConfig } from './_execute-tests';

const options = {
  warnUnmatched: false,
  reusePatterns: {
    name: '[a-z][a-z0-9]*(?:-[a-z][a-z0-9]*)*',
    theme: '(?:\\.(?:foo|bar))*',
  },
  pathPatterns: ['^.*/src/test/foo(\\.\\w+)?\\.ts$', '^.*src/test/[\\s\\S]*.ts$'],
  patterns: [
    {
      name: '^(TestComponent)$',
      file: '.*[src/test/test.component](<theme>)?\\.ts$',
    },
  ],
  ignoredFiles: ['foo.ts$'],
};

const config: RuleTestConfig = {
  ruleName: 'project-structure',
  rule: projectStructureRule,
  tests: {
    valid: [
      // files which matches the ignored list don't need to match any following pattern
      {
        options: [options],
        filename: 'path/src/baz/whatever/foo.ts',
        code: `
        @Component({})
        export class FooComponent {
        }
        `,
      },
      // files which matches path pattern is valid, when warnUnmatched is false
      {
        options: [{ ...options, warnUnmatched: false }],
        filename: 'path/src/test/bar.ts',
        code: `
        @Component({})
        export class TestComponent {
        }
        `,
      },
      // files which matches path pattern and class name pattern are valid
      {
        options: [{ ...options, warnUnmatched: true }],
        filename: 'path/src/test/test.ts',
        code: `
        @Component({})
        export class TestComponent {
        }
        `,
      },
      // extending a class should not impact validity
      {
        options: [{ ...options, warnUnmatched: true }],
        filename: 'path/src/test/test.ts',
        code: `
        @Component({})
        export class TestComponent extends OtherComponent {
        }
        `,
      },
      // kebab conversion should work
      {
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
            warnUnmatched: true,
          },
        ],
        filename: 'path/src/pages/foo-bar/foo-bar-page.component.ts',
        code: `
        @Component({})
        export class FooBarPageComponent {
        }
        `,
      },
      // kebab conversion should work with allowed word containing a number
      {
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
      // files doesn't match path pattern when path is invalid and warnUnmatched is false
      {
        options: [{ ...options, warnUnmatched: false }],
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
      // files doesn't match class name pattern when path is valid, class name is invalid and warnUnmatched is true
      {
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
      // file doesn't match  kebab class name pattern when it contains a number word that isn't allowed
      {
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
              message:
                "'TestB2BComponent' is not in the correct file (expected '/src/test/test-b-2-b.component.ts$/')".replace(
                  // hack to circumvent automatic string formatting
                  '/src/test/test-b-2-b.component.ts$/',
                  '/src\\/test\\/test-b-2-b.component.ts$/'
                ),
            },
          },
        ],
      },
    ],
  },
};

export default config;
