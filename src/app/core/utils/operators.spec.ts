import { createAction } from '@ngrx/store';
import { cold, hot } from 'jest-marbles';
import { of } from 'rxjs';

import { httpError } from 'ish-core/utils/ngrx-creators';

import { makeHttpError } from './dev/api-service-utils';
import { distinctCompareWith, mapErrorToAction, mapToProperty } from './operators';

describe('Operators', () => {
  describe('distinctCompareWith', () => {
    it('should fire only when stream value is different than constant compare value and value is changed', () => {
      const compare$ = of('a');
      const input$ = hot('a-b-b-a-a-a-b-c-a-a');
      const expt$ = cold('--b-----------c----');

      expect(input$.pipe(distinctCompareWith(compare$))).toBeObservable(expt$);
    });

    it('should fire only when stream value is different than flexible compare value and value is changed', () => {
      const compa$ = hot('--a-b-b-a-a-a-b-c-a');
      const input$ = hot('a-b-b-a-a-a-b-c-a-a');
      const expt$ = cold('--b---a-----b-c-a--');

      expect(input$.pipe(distinctCompareWith(compa$))).toBeObservable(expt$);
    });
  });

  describe('mapErrorToAction', () => {
    const dummyFail = createAction('dummy', httpError());

    it('should catch HttpErrorResponse and convert them to Fail actions', () => {
      const error = makeHttpError({
        status: 404,
        headers: { key: 'value' },
      });

      const input$ = hot('---#', undefined, error);
      const resu$ = cold('---(a|)', {
        a: {
          payload: { error },
          type: 'dummy',
        },
      });

      expect(input$.pipe(mapErrorToAction(dummyFail))).toBeObservable(resu$);
    });

    it('should rethrow other errors when encountering them', () => {
      const error = new Error('other error');

      const input$ = hot('---#', undefined, error);
      const resu$ = cold('---#');

      expect(input$.pipe(mapErrorToAction(dummyFail))).toBeObservable(resu$);
    });
  });

  describe('mapToProperty', () => {
    it('should map to property', () => {
      expect(of({ test: 'hello world' }).pipe(mapToProperty('test'))).toBeObservable(
        cold('(a|)', { a: 'hello world' })
      );
    });

    it('should ignore falsy input when used', done => {
      of(undefined)
        .pipe(mapToProperty('test'))
        .subscribe(data => {
          expect(data).toBeUndefined();
          done();
        });
    });
  });
});
