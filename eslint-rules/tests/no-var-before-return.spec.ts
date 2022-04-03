import noVarBeforeReturnRule from '../src/rules/no-var-before-return';

import testRule from './rule-tester';

testRule(noVarBeforeReturnRule, {
  valid: [
    {
      name: 'should not report if there is a declaration with deconstruction',
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
      name: 'should not report if there is a modification before return',
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
      name: 'should report if there is a declaration right before return (primitive data type)',
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
      name: 'should report if there is a declaration right before return (complex data type)',
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
});
