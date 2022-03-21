import { meaningfulDescribeInTestsRule } from '../src/rules/meaningful-describe-in-tests';

import { RuleTestConfig } from './_execute-tests';

const config: RuleTestConfig = {
  ruleName: 'meaningful-describe-in-tests',
  rule: meaningfulDescribeInTestsRule,
  tests: {
    valid: [
      {
        filename: 'test.component.spec.ts',
        code: `describe('Test Component', () => {});`,
      },
      {
        filename: 'test.component.spec.ts',
        code: `describe('Test Component', () => {
          describe('something embedded', () => {});
        });`,
      },
    ],
    invalid: [
      {
        filename: 'test.component.spec.ts',
        code: `describe('Test', () => {});`,
        errors: [{ messageId: 'meaningfulDescribeInTests' }],
        output: `describe('Test Component', () => {});`,
      },
      {
        filename: 'test.component.spec.ts',
        code: `describe('Test', () => {}); describe('Test2', () => {});`,
        errors: [{ messageId: 'meaningfulDescribeInTests' }, { messageId: 'meaningfulDescribeInTests' }],
        output: `describe('Test Component', () => {}); describe('Test Component', () => {});`,
      },
    ],
  },
};

export default config;
