import { AST_NODE_TYPES } from '@typescript-eslint/utils';

import noFormlyExplicitPseudoTypeRule from '../src/rules/no-formly-explicit-pseudo-type';

import testRule from './rule-tester';

testRule(noFormlyExplicitPseudoTypeRule, {
  valid: [
    {
      name: 'should not report when types are named without #',
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
      name: 'should report when type starts with #',
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
