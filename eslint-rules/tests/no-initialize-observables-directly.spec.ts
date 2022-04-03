import { AST_NODE_TYPES } from '@typescript-eslint/utils';

import noInitializeObservablesDirectlyRule from '../src/rules/no-initialize-observables-directly';

import testRule from './rule-tester';

testRule(noInitializeObservablesDirectlyRule, {
  valid: [
    {
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
  ],
});
