import { AST_NODE_TYPES } from '@typescript-eslint/utils';

import useAsyncSynchronizationInTestsRule from '../src/rules/use-async-synchronization-in-tests';

import testRule from './rule-tester';

testRule(useAsyncSynchronizationInTestsRule, {
  valid: [
    {
      name: 'should not report if subscribe is used with done invocation',
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
      name: 'should not report if subscribe is used with done as a parameter to subscribe',
      filename: 'test.spec.ts',
      code: `
        it('should do test', done => {
          testObs.subscribe(done,fail,fail);
        })
        `,
    },
    {
      name: 'should not report if subscribe is used with done as partial subscriber',
      filename: 'test.spec.ts',
      code: `
        it('should do test', done => {
          testObs.subscribe({complete: done});
        })
        `,
    },
    {
      name: 'should not report if subscribe is used inside fakeAsync',
      filename: 'test.spec.ts',
      code: `
        it('should do test', fakeAsync(() => {
          testObs.subscribe();
        }))
        `,
    },
    {
      name: 'should not report if done is used inside setTimeout',
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
      name: 'should not report if done is used directly',
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
      name: 'should report if subscribe is used without done',
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
});
