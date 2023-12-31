import { AST_NODE_TYPES } from '@typescript-eslint/utils';

import privateDestroyRefFieldRule from '../src/rules/private-destroyRef-field';

import testRule from './rule-tester';

testRule(privateDestroyRefFieldRule, {
  valid: [
    {
      name: 'should not report if destroyRef injected dependency is used correctly',
      filename: 'test.component.ts',
      code: `
        @Component({})
        export class TestComponent  {
          private destroyRef = inject(DestroyRef);
        }
        `,
    },
  ],
  invalid: [
    {
      name: 'should report if destroyRef injected dependency not inject correct dependency',
      filename: 'test.component.ts',
      code: `
        @Component({})
        export class TestComponent  {
          private destroyRef = inject(WrongDependency);
        }
        `,
      errors: [
        {
          messageId: 'injectDestroyRefError',
          type: AST_NODE_TYPES.PropertyDefinition,
        },
      ],
    },
    {
      name: 'should report if destroyRef injected dependency call a wrong call expression',
      filename: 'test.component.ts',
      code: `
        @Component({})
        export class TestComponent  {
          private destroyRef = test();
        }
        `,
      errors: [
        {
          messageId: 'injectDestroyRefError',
          type: AST_NODE_TYPES.PropertyDefinition,
        },
      ],
    },
    {
      name: 'should report if destroyRef injected dependency is implicitely public',
      filename: 'test.component.ts',
      code: `
        @Component({})
        export class TestComponent  {
          destroyRef = inject(DestroyRef);
        }
        `,
      errors: [
        {
          messageId: 'privateDestroyRefError',
          type: AST_NODE_TYPES.PropertyDefinition,
        },
      ],
      output: `
        @Component({})
        export class TestComponent  {
          private destroyRef = inject(DestroyRef);
        }
        `,
    },
    {
      name: 'should report if destroyRef injected dependency is explicitely public',
      filename: 'test.component.ts',
      code: `
        @Component({})
        export class TestComponent  {
          public destroyRef = inject(DestroyRef);
        }
        `,
      errors: [
        {
          messageId: 'privateDestroyRefError',
          type: AST_NODE_TYPES.PropertyDefinition,
        },
      ],
      output: `
        @Component({})
        export class TestComponent  {
          private destroyRef = inject(DestroyRef);
        }
        `,
    },
    {
      name: 'should report if destroyRef injected dependency is explicitely protected',
      filename: 'test.component.ts',
      code: `
        @Component({})
        export class TestComponent  {
          protected destroyRef = inject(DestroyRef);
        }
        `,
      errors: [
        {
          messageId: 'privateDestroyRefError',
          type: AST_NODE_TYPES.PropertyDefinition,
        },
      ],
      output: `
        @Component({})
        export class TestComponent  {
          private destroyRef = inject(DestroyRef);
        }
        `,
    },
    {
      name: 'should report if destroyRef injected dependency is not private and does not inject correct ependency',
      filename: 'test.component.ts',
      code: `
        @Component({})
        export class TestComponent  {
          destroyRef = inject(WrongDependency);
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
          private destroyRef = inject(WrongDependency);
        }
        `,
    },
  ],
});
