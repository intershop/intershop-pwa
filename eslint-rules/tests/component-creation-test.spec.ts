import { AST_NODE_TYPES } from '@typescript-eslint/utils';

import componentCreationTestRule, { SHOULD_BE_CREATED_NAME } from '../src/rules/component-creation-test';

import testRule from './rule-tester';

testRule(componentCreationTestRule, {
  valid: [
    {
      name: 'should not report when everything is tested',
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
      name: 'should not report when file is not a test file',
      filename: 'test.component.ts',
      code: ``,
    },
  ],
  invalid: [
    {
      name: 'should report when top level describe is missing',
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
      name: `should report when test name "${SHOULD_BE_CREATED_NAME}" cannot be found`,
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
      name: 'should report when component truthy test is missing',
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
      name: 'should report when element truthy test is missing',
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
      name: 'should report when fixture.detectChanges test is missing',
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
});
