import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Action } from '@ngrx/store';
import { cold, hot } from 'jest-marbles';
import { Observable, merge, of } from 'rxjs';
import { concatMap, filter, last, mapTo } from 'rxjs/operators';

import { HttpError } from '../models/http-error/http-error.model';

import { Partition, distinctCompareWith, mapErrorToAction, partitionBy } from './operators';

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

  describe('partitionBy', () => {
    describe('merge usage', () => {
      it('should always split input into two streams', () => {
        const input$ = hot('1-2-3-4-5-6-7-8-9--|') as Observable<number>;
        const resu$ = cold('--X---X-5-X-7-X-9--(C|)');

        const output$ = input$.pipe(
          partitionBy(num => num % 2 === 0),
          concatMap(part =>
            merge(
              part.isTrue.pipe(mapTo('X')),
              part.isFalse.pipe(filter(x => x > 4)),
              part.isTrue.pipe(
                last(),
                mapTo('C')
              )
            )
          )
        );

        expect(output$).toBeObservable(resu$);
      });
    });

    describe('local variable usage', () => {
      let partition$: Observable<Partition<number>>;

      beforeEach(() => {
        const input$ = hot('1-2-3-4-5-6-7-8-9--|') as Observable<number>;
        partition$ = input$.pipe(partitionBy(x => x % 2 === 0));
      });

      it('should fire when true path emits', () => {
        const output$ = partition$.pipe(concatMap(part => part.isTrue));
        expect(output$).toBeObservable(cold('--2---4---6---8----|'));
      });

      it('should fire when false path emits', () => {
        const output$ = partition$.pipe(
          concatMap(part => part.isFalse),
          mapTo('X')
        );
        expect(output$).toBeObservable(cold('X---X---X---X---X--|'));
      });
    });
  });

  describe('mapErrorToAction', () => {
    // tslint:disable-next-line:prefer-mocks-instead-of-stubs-in-tests
    class DummyFail implements Action {
      type = 'dummy';
      constructor(public payload: HttpError) {}
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
            name: 'HttpErrorResponse',
            message: 'Http failure response for http://example.org: 404 undefined',
            error: 'null',
            status: 404,
            statusText: 'Unknown Error',
            headers: {
              key: 'value',
            },
          } as HttpError,
          type: 'dummy',
        },
      });

      expect(input$.pipe(mapErrorToAction(DummyFail))).toBeObservable(resu$);
    });
  });
});
