import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Action } from '@ngrx/store';
import { cold, hot } from 'jest-marbles';
import { of } from 'rxjs';

import { HttpError } from 'ish-core/models/http-error/http-error.model';

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
    class DummyFail implements Action {
      type = 'dummy';
      constructor(public payload: { error: HttpError }) {}
    }

    it('should catch HttpErrorResponses and convert them to Fail actions', () => {
      const error = new HttpErrorResponse({
        status: 404,
        headers: new HttpHeaders({ key: 'value' }),
        url: 'http://example.org',
      });

      const input$ = hot('---#', undefined, error);
      const resu$ = cold('---(a|)', {
        a: {
          payload: {
            error: {
              name: 'HttpErrorResponse',
              message: 'Http failure response for http://example.org: 404 undefined',
              error: undefined,
              errorCode: undefined,
              status: 404,
              statusText: 'Unknown Error',
              headers: {
                key: 'value',
              },
            } as HttpError,
          },
          type: 'dummy',
        },
      });

      expect(input$.pipe(mapErrorToAction(DummyFail))).toBeObservable(resu$);
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
