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
        },
      ],
    },
  ],
});
