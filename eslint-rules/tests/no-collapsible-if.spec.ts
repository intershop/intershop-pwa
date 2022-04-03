import { AST_NODE_TYPES } from '@typescript-eslint/utils';

import noCollapsibleIfRule from '../src/rules/no-collapsible-if';

import testRule from './rule-tester';

testRule(noCollapsibleIfRule, {
  valid: [
    {
      name: 'should not report on collapsed if statements',
      filename: 'test.component.ts',
      code: `
        if(a === b && c === d) {
          const foo = bar;
        }
        `,
    },
    {
      name: 'should not report when a block comes after a if statement',
      filename: 'test.component.ts',
      code: `
        if(a === b && c === d) {
          if(foo.bar()) {
            const foo = bar;
          }
          return test;
        }
        `,
    },
    {
      name: 'should not report when else is used',
      filename: 'test.component.ts',
      code: `
        if(a === b && c === d) {
          if(foo.bar()) {
            const foo = bar;
          }
        } else {
          return foo;
        }
        `,
    },
    {
      name: 'should not report when nested else is used',
      filename: 'test.component.ts',
      code: `
        if(a === b && c === d) {
          if(foo.bar()) {
            const foo = bar;
          } else {
            return foo;
          }
        }
        `,
    },
  ],
  invalid: [
    {
      name: 'should report if conditions can be collapsed',
      filename: 'test.component.ts',
      code: `
        let test = foo;
        if(a === b) {
          if(c === d) {
            const foo = bar;
            test = foo.baz();
            return test;
          }
        }
        `,
      output: `
        let test = foo;
        if((a === b) && (c === d)){
                      const foo = bar;
            test = foo.baz();
            return test;
          }
        `,
      errors: [
        {
          messageId: 'noCollapsibleIfError',
          type: AST_NODE_TYPES.IfStatement,
        },
      ],
    },
  ],
});
