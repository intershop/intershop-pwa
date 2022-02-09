import { noVarBeforeReturnRule } from '../src/rules/no-var-before-return';

import { RuleTestConfig } from './_execute-tests';

const config: RuleTestConfig = {
  ruleName: 'no-var-before-return',
  rule: noVarBeforeReturnRule,
  tests: {
    valid: [
      {
        filename: 'test.ts',
        code: `
      function testFunction() {
        const obj =  { a: 12, b: 'abc' };
        const { a, b } = obj;
        return a;
      }
      `,
      },
      {
        filename: 'test.ts',
        code: `
      function testFunction() {
        let a = 23;
        a += 1;
        return a;
      }
      `,
      },
    ],
    invalid: [
      {
        filename: 'test.ts',
        code: `
        function testFunction() {
          let abc = '123';
          return abc;
        }
        `,
        output: `
        function testFunction() {
          return '123';
        }
        `,
        errors: [
          {
            messageId: 'varError',
            line: 3,
          },
        ],
      },
      {
        filename: 'test.ts',
        code: `
        function testFunction() {
          let abc = new RegExp('ab+c', 'i');
          return abc;
        }
        `,
        output: `
        function testFunction() {
          return new RegExp('ab+c', 'i');
        }
        `,
        errors: [
          {
            messageId: 'varError',
            line: 3,
          },
        ],
      },
    ],
  },
};

export default config;
