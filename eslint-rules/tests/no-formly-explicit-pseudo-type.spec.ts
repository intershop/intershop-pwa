import { AST_NODE_TYPES } from '@typescript-eslint/utils';

import noFormlyExplicitPseudoTypeRule from '../src/rules/no-formly-explicit-pseudo-type';

import testRule from './rule-tester';

testRule(noFormlyExplicitPseudoTypeRule, {
  valid: [
    // this will probably never happen but it's tested nontheless
    {
      filename: 'test.module.ts',
      code: `
      @NgModule({
        imports: [
          FormlyBaseModule.forChild({
            types: [
              {
                name: '#test'
              }
            ]
          })
        ]
      })
      export class TestModule {}
      `,
    },
    {
      filename: 'types.module.ts',
      code: `
        @NgModule({
          imports: [
            FormlyBaseModule.forChild({
              types: [
                {
                  name: 'test'
                }
              ]
            })
          ]
        })
        export class TypesModule {}
        `,
    },
  ],
  invalid: [
    {
      filename: 'types.module.ts',
      code: `
        @NgModule({
          imports: [
            FormlyBaseModule.forChild({
              types: [
                {
                  name: '#test'
                }
              ]
            })
          ]
        })
        export class TypesModule {}
        `,
      errors: [
        {
          type: AST_NODE_TYPES.ObjectExpression,
          messageId: 'explicitPseudoTypeError',
        },
      ],
    },
  ],
});
