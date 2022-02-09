import { AST_NODE_TYPES } from '@typescript-eslint/experimental-utils';

import { componentCreationTestRule } from '../src/rules/component-creation-test';

import { RuleTestConfig } from './_execute-tests';

const SHOULD_BE_CREATED_NAME = 'should be created';

const config: RuleTestConfig = {
  ruleName: 'component-creation-test',
  rule: componentCreationTestRule,
  tests: {
    valid: [
      {
        filename: 'test.component.spec.ts',
        code: `
      describe('Test Component', () => {
        it('${SHOULD_BE_CREATED_NAME}', () => {
          expect(component).toBeTruthy();
          expect(element).toBeTruthy();
          expect(() => fixture.detectChanges()).not.toThrow();
        });
      })
      `,
      },
      {
        filename: 'test.component.ts',
        code: ``,
      },
    ],
    invalid: [
      {
        filename: 'test.component.spec.ts',
        code: `
        it('${SHOULD_BE_CREATED_NAME}', () => {
          expect(component).toBeTruthy();
          expect(element).toBeTruthy();
          expect(() => fixture.detectChanges()).not.toThrow();
        });
      `,
        errors: [
          {
            messageId: 'noDescribe',
            type: AST_NODE_TYPES.Program,
          },
        ],
      },
      {
        filename: 'test.component.spec.ts',
        code: `
      describe('Test Component', () => {
        it('invalid_name', () => {
          expect(component).toBeTruthy();
          expect(element).toBeTruthy();
          expect(() => fixture.detectChanges()).not.toThrow();
        });
      })
      `,
        errors: [
          {
            messageId: 'noCreationTest',
            type: AST_NODE_TYPES.Identifier,
          },
        ],
      },
      {
        filename: 'test.component.spec.ts',
        code: `
      describe('Test Component', () => {
        it('${SHOULD_BE_CREATED_NAME}', () => {
          expect(element).toBeTruthy();
          expect(() => fixture.detectChanges()).not.toThrow();
        });
      })
      `,
        errors: [
          {
            messageId: 'noComponentTruthyTest',
            type: AST_NODE_TYPES.Identifier,
          },
        ],
      },
      {
        filename: 'test.component.spec.ts',
        code: `
      describe('Test Component', () => {
        it('${SHOULD_BE_CREATED_NAME}', () => {
          expect(component).toBeTruthy();
          expect(() => fixture.detectChanges()).not.toThrow();
        });
      })
      `,
        errors: [
          {
            messageId: 'noElementTruthyTest',
            type: AST_NODE_TYPES.Identifier,
          },
        ],
      },
      {
        filename: 'test.component.spec.ts',
        code: `
      describe('Test Component', () => {
        it('${SHOULD_BE_CREATED_NAME}', () => {
          expect(component).toBeTruthy();
          expect(element).toBeTruthy();
        });
      })
      `,
        errors: [
          {
            messageId: 'noFixtureDetectChangesTest',
            type: AST_NODE_TYPES.Identifier,
          },
        ],
      },
    ],
  },
};

export default config;
