import { AST_NODE_TYPES } from '@typescript-eslint/utils';

import sortStandaloneComponentImportsRule from '../src/rules/sort-standalone-component-imports';

import testRule from './rule-tester';

testRule(sortStandaloneComponentImportsRule, {
  valid: [
    {
      name: 'should not report if component imports are sorted correctly (simple)',
      filename: 'test.component.ts',
      code: `
          @Component({
            imports: [A,B]
          })
          export class TestComponent {}
        `,
    },
    {
      name: 'should not report if component imports are sorted correctly (complex)',
      filename: 'test.component.ts',
      code: `
          @Component({
            imports: [
              AsyncPipe,
              MockComponent(A),
              RouterLink,
            ]
          })
          export class TestComponent {}
        `,
    },
    {
      name: 'should not report imports arrays outside of component decorators',
      filename: 'test.component.ts',
      code: `
          TestBed.configureTestingModule({
            imports: [B,A]
          })
        `,
    },
    {
      name: 'should skip imports with spread elements',
      filename: 'test.component.ts',
      code: `
          @Component({
            imports: [B, ...imports, A]
          })
          export class TestComponent {}
        `,
    },
  ],
  invalid: [
    {
      name: 'should sort component imports (simple)',
      filename: 'test.component.ts',
      code: `
          @Component({
            imports: [B,A]
          })
          export class TestComponent {}
        `,
      errors: [
        {
          messageId: 'sortStandaloneComponentImports',
          type: AST_NODE_TYPES.Identifier,
        },
      ],
      output: `
          @Component({
            imports: [A,B]
          })
          export class TestComponent {}
        `,
    },
    {
      name: 'should sort component imports (complex)',
      filename: 'test.component.ts',
      code: `
          @Component({
            imports: [
              RouterLink,
              TranslatePipe,
              AsyncPipe,
              NgClass,
            ]
          })
          export class TestComponent {}
        `,
      errors: [
        {
          messageId: 'sortStandaloneComponentImports',
          type: AST_NODE_TYPES.Identifier,
        },
      ],
      output: `
          @Component({
            imports: [
              AsyncPipe,
              NgClass,
              RouterLink,
              TranslatePipe,
            ]
          })
          export class TestComponent {}
        `,
    },
    {
      name: 'should sort component imports with call expressions',
      filename: 'test.component.ts',
      code: `
          @Component({
            imports: [
              MockComponent(B),
              MockComponent(A),
            ]
          })
          export class TestComponent {}
        `,
      errors: [
        {
          messageId: 'sortStandaloneComponentImports',
          type: AST_NODE_TYPES.CallExpression,
        },
      ],
      output: `
          @Component({
            imports: [
              MockComponent(A),
              MockComponent(B),
            ]
          })
          export class TestComponent {}
        `,
    },
  ],
});
