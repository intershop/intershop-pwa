import { Observable, OperatorFunction, of } from 'rxjs';
import { catchError, distinctUntilChanged, filter, map, partition, withLatestFrom } from 'rxjs/operators';

import { HttpErrorMapper } from '../models/http-error/http-error.mapper';
import { HttpError } from '../models/http-error/http-error.model';

export interface Partition<T> {
  isTrue: Observable<T>;
  isFalse: Observable<T>;
}

/**
 * partition a stream by a given predicate
 */
export function partitionBy<T>(predicate: (value: T) => boolean): OperatorFunction<T, Partition<T>> {
  return (source$: Observable<T>) =>
    source$.pipe(
      inp => of(partition(predicate)(inp)),
      map(([a, b]) => ({ isTrue: a, isFalse: b }))
    );
}

/**
 * compare the current stream with the latest value from given observable distinctively and fire only when value is different than the observable value and the last fired value
 */
export function distinctCompareWith<T>(observable: Observable<T>): OperatorFunction<T, T> {
  return (source$: Observable<T>) =>
    source$.pipe(
      withLatestFrom(observable),
      filter(([newVal, oldVal]) => newVal !== oldVal),
      map(([newVal]) => newVal),
      distinctUntilChanged()
    );
}

export function mapErrorToAction<S, T>(actionType: { new (error: HttpError): T }) {
  return (source$: Observable<S | T>) =>
    // tslint:disable-next-line:ban
    source$.pipe(catchError(err => of(new actionType(HttpErrorMapper.fromError(err)))));
}
