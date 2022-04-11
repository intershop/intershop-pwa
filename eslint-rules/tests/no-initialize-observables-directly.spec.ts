import { AST_NODE_TYPES } from '@typescript-eslint/utils';

import noInitializeObservablesDirectlyRule from '../src/rules/no-initialize-observables-directly';

import testRule from './rule-tester';

testRule(noInitializeObservablesDirectlyRule, {
  valid: [
    {
      name: 'should not report when observables are initialized in ngOnInit',
      filename: 'test.component.ts',
      code: `
        @Component({})
        export class TestComponent implements OnInit {
          observable$: Observable<any>;
          ngOnInit() {
            this.observable$ = new Observable();
          }
        }
        `,
    },
    {
      name: 'should not report when Subjects are initialized directly',
      filename: 'test.component.ts',
      code: `
        @Component({})
        export class TestComponent {
          observable$ = new Subject<any>()
        }
        `,
    },
  ],
  invalid: [
    {
      name: 'should report when observables are initialized in field declarations',
      filename: 'test.component.ts',
      code: `
        @Component({})
        export class TestComponent {
          observable$ = new Observable<any>()
        }
        `,
      errors: [
        {
          messageId: 'wrongInitializeError',
          type: AST_NODE_TYPES.PropertyDefinition,
        },
      ],
    },
    {
      name: 'should report when observables are initialized in constructors',
      filename: 'test.component.ts',
      code: `
        @Component({})
        export class TestComponent {
          observable$: Observable<any>;
          constructor() {
            observable$ = new Observable<any>();
          }
        }
        `,
      errors: [
        {
          messageId: 'wrongInitializeError',
          type: AST_NODE_TYPES.AssignmentExpression,
        },
      ],
    },
  ],
});
