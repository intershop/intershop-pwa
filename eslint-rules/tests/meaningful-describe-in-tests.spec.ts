import meaningfulDescribeInTestsRule from '../src/rules/meaningful-describe-in-tests';

import testRule from './rule-tester';

testRule(meaningfulDescribeInTestsRule, {
  valid: [
    {
      name: 'should not report when test describe is derived from file name',
      filename: 'test.component.spec.ts',
      code: `describe('Test Component', () => {});`,
    },
    {
      name: 'should not report on embedded test describe',
      filename: 'test.component.spec.ts',
      code: `describe('Test Component', () => {
          describe('something embedded', () => {});
        });`,
    },
  ],
  invalid: [
    {
      name: 'should report when test describe is not derived from file name',
      filename: 'test.component.spec.ts',
      code: `describe('Test', () => {});`,
      errors: [{ messageId: 'meaningfulDescribeInTests' }],
      output: `describe('Test Component', () => {});`,
    },
    {
      name: 'should report multiple times when test describe is not derived from file name',
      filename: 'test.component.spec.ts',
      code: `describe('Test', () => {}); describe('Test2', () => {});`,
      errors: [{ messageId: 'meaningfulDescribeInTests' }, { messageId: 'meaningfulDescribeInTests' }],
      output: `describe('Test Component', () => {}); describe('Test Component', () => {});`,
    },
  ],
});
