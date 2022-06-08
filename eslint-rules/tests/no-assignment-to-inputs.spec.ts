import { AST_NODE_TYPES } from '@typescript-eslint/utils';

import noAssignmentToInputsRule from '../src/rules/no-assignment-to-inputs';

import testRule from './rule-tester';

testRule(noAssignmentToInputsRule, {
  valid: [
    {
      name: 'should not report when no assignments are found',
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
      name: 'should report when assignments to input fields are found',
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
  ],
});
