import { AST_NODE_TYPES } from '@typescript-eslint/experimental-utils';

import { useAsyncSynchronizationInTestsRule } from '../src/rules/use-async-synchronization-in-tests';

import { RuleTestConfig } from './_execute-tests';

const config: RuleTestConfig = {
  ruleName: 'use-async-synchronization-in-tests',
  rule: useAsyncSynchronizationInTestsRule,
  tests: {
    valid: [
      {
        filename: 'test.spec.ts',
        code: `
        it('should do test', done => {
          testObs.subscribe(value => {
            expect(value).toBe('value');
            done();
          })
        })
        `,
      },
      {
        filename: 'test.spec.ts',
        code: `
        it('should do test', done => {
          testObs.subscribe(done,fail,fail);
        })
        `,
      },
      {
        filename: 'test.spec.ts',
        code: `
        it('should do test', done => {
          testObs.subscribe({complete: done});
        })
        `,
      },
      {
        filename: 'test.spec.ts',
        code: `
        it('should do test', fakeAsync(() => {
          testObs.subscribe();
        }))
        `,
      },
      {
        filename: 'test.spec.ts',
        code: `
        it('should do test', done => {
          testObs.subscribe(fail,fail,fail);
          setTimeout(() => {
            verify(storeSpy$.dispatch(anything())).never();
            done();
          }, 2000);
        })
        `,
      },
      {
        filename: 'test.spec.ts',
        code: `
        it('should do test', done => {
          testObs.subscribe(fail,fail,fail);
          done();
        })
        `,
      },
    ],
    invalid: [
      {
        filename: 'test.spec.ts',
        code: `
        it('should do test', done => {
          testObs.subscribe(value => {
            expect(value).toBe('value');
          })
        })
        `,
        errors: [{ messageId: 'noDoneError', type: AST_NODE_TYPES.CallExpression }],
      },
    ],
  },
};

export default config;
