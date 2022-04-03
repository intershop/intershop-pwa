import { AST_NODE_TYPES } from '@typescript-eslint/utils';

import noCollapsibleIfRule from '../src/rules/no-collapsible-if';

import testRule from './rule-tester';

testRule(noCollapsibleIfRule, {
  valid: [
    {
      filename: 'test.component.ts',
      code: `
        if(a === b && c === d) {
          const foo = bar;
        }
        `,
    },
    {
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
      filename: 'test.component.ts',
      code: `
        let test = foo;
        if(a === b) {
          if(c=== d) {
            const foo = bar;
            test = foo.baz();
            return test;
          }
        }
        `,
      output: `
        let test = foo;
        if((a === b) && (c=== d)){
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
