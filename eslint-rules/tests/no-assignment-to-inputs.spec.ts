import { AST_NODE_TYPES } from '@typescript-eslint/experimental-utils';

import { noAssignmentToInputsRule } from '../src/rules/no-assignment-to-inputs';

import { RuleTestConfig } from './_execute-tests';

const config: RuleTestConfig = {
  ruleName: 'no-assignment-to-inputs',
  rule: noAssignmentToInputsRule,
  tests: {
    valid: [
      {
        filename: 'test.component.ts',
        code: `
        @Component({})
        export class TestComponent  {
          @Input() testInput;
        }
        `,
      },
    ],
    invalid: [
      {
        filename: 'test.component.ts',
        code: `
        @Component({})
        export class TestComponent  {
          @Input() testInput;

          testFunction() {
            this.testInput = variable;
          }
        }
        `,
        errors: [
          {
            messageId: 'inputAssignmentError',
            type: AST_NODE_TYPES.AssignmentExpression,
          },
        ],
      },
      {
        filename: 'test.component.ts',
        code: `
        @Component({})
        export class TestComponent  {
         @Output() @Input() testInput;

          testFunction() {
            this.testInput = variable;
          }
        }
        `,
        errors: [
          {
            messageId: 'inputAssignmentError',
            type: AST_NODE_TYPES.AssignmentExpression,
          },
        ],
      },
    ],
  },
};

export default config;
