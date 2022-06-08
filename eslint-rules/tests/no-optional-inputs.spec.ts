import noOptionalInputsRule from '../src/rules/no-optional-inputs';

import testRule from './rule-tester';

testRule(noOptionalInputsRule, {
  valid: [
    {
      name: 'should not report when inputs do not use the optional operator',
      code: 'export class MyComponent { @Input() foo: string; }',
    },
  ],
  invalid: [
    {
      name: 'should report when inputs use the optional operator',
      code: 'export class MyComponent { @Input() foo?: string; }',
      errors: [
        {
          messageId: 'doNotUseOptionalOperatorOnInputs',
        },
      ],
      output: 'export class MyComponent { @Input() foo: string; }',
    },
  ],
});
