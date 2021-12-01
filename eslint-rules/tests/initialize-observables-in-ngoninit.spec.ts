import { AST_NODE_TYPES } from '@typescript-eslint/experimental-utils';

import { initializeObservablesInNgoninitRule } from '../src/rules/initialize-observables-in-ngoninit';

import { RuleTestConfig } from './_execute-tests';

const config: RuleTestConfig = {
  ruleName: 'initialize-observables-in-ngoninit',
  rule: initializeObservablesInNgoninitRule,
  tests: {
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
            type: AST_NODE_TYPES.ClassProperty,
          },
        ],
      },
    ],
  },
};

export default config;
