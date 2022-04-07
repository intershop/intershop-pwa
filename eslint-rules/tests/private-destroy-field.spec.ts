import { AST_NODE_TYPES } from '@typescript-eslint/utils';

import privateDestroyFieldRule from '../src/rules/private-destroy-field';

import testRule from './rule-tester';

testRule(privateDestroyFieldRule, {
  valid: [
    {
      name: 'should not report if destroy$ subject is used correctly',
      filename: 'test.component.ts',
      code: `
        @Component({})
        export class TestComponent  {
          private destroy$ = new Subject<void>();
        }
        `,
    },
  ],
  invalid: [
    {
      name: 'should report if destroy$ is not used with Subject',
      filename: 'test.component.ts',
      code: `
        @Component({})
        export class TestComponent  {
          private destroy$ = new BehaviorSubject<void>(null);
        }
        `,
      errors: [
        {
          messageId: 'voidSubjectError',
          type: AST_NODE_TYPES.PropertyDefinition,
        },
      ],
    },
    {
      name: 'should report if destroy$ subject is not used with void',
      filename: 'test.component.ts',
      code: `
        @Component({})
        export class TestComponent  {
          private destroy$ = new Subject<any>();
        }
        `,
      errors: [
        {
          messageId: 'voidSubjectError',
          type: AST_NODE_TYPES.PropertyDefinition,
        },
      ],
      output: `
        @Component({})
        export class TestComponent  {
          private destroy$ = new Subject<void>();
        }
        `,
    },
    {
      name: 'should report if destroy$ subject is implicitely public',
      filename: 'test.component.ts',
      code: `
        @Component({})
        export class TestComponent  {
          destroy$ = new Subject<void>();
        }
        `,
      errors: [
        {
          messageId: 'privateDestroyError',
          type: AST_NODE_TYPES.PropertyDefinition,
        },
      ],
      output: `
        @Component({})
        export class TestComponent  {
          private destroy$ = new Subject<void>();
        }
        `,
    },
    {
      name: 'should report if destroy$ subject is explicitely public',
      filename: 'test.component.ts',
      code: `
        @Component({})
        export class TestComponent  {
          public destroy$ = new Subject<void>();
        }
        `,
      errors: [
        {
          messageId: 'privateDestroyError',
          type: AST_NODE_TYPES.PropertyDefinition,
        },
      ],
      output: `
        @Component({})
        export class TestComponent  {
          private destroy$ = new Subject<void>();
        }
        `,
    },
    {
      name: 'should report if destroy$ subject is explicitely protected',
      filename: 'test.component.ts',
      code: `
        @Component({})
        export class TestComponent  {
          protected destroy$ = new Subject<void>();
        }
        `,
      errors: [
        {
          messageId: 'privateDestroyError',
          type: AST_NODE_TYPES.PropertyDefinition,
        },
      ],
      output: `
        @Component({})
        export class TestComponent  {
          private destroy$ = new Subject<void>();
        }
        `,
    },
    {
      name: 'should report if destroy$ subject is not private and does not use void',
      filename: 'test.component.ts',
      code: `
        @Component({})
        export class TestComponent  {
          destroy$ = new Subject();
        }
        `,
      errors: [
        {
          messageId: 'bothError',
          type: AST_NODE_TYPES.PropertyDefinition,
        },
      ],
      output: `
        @Component({})
        export class TestComponent  {
          private destroy$ = new Subject<void>();
        }
        `,
    },
    {
      name: 'should report if destroy$ subject is not private and does not use Subject',
      filename: 'test.component.ts',
      code: `
        @Component({})
        export class TestComponent  {
          destroy$ = new BehaviorSubject<void>(null);
        }
        `,
      errors: [
        {
          messageId: 'bothError',
          type: AST_NODE_TYPES.PropertyDefinition,
        },
      ],
    },
  ],
});
