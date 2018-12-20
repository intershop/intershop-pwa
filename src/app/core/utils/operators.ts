// tslint:disable:ban-specific-imports
import { Observable, OperatorFunction, of } from 'rxjs';
import { catchError, distinctUntilChanged, filter, map, partition, withLatestFrom } from 'rxjs/operators';

import { HttpErrorMapper } from 'ish-core/models/http-error/http-error.mapper';
import { HttpError } from 'ish-core/models/http-error/http-error.model';

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

export function mapErrorToAction<S, T>(actionType: new (error: { error: HttpError }) => T) {
  return (source$: Observable<S | T>) =>
    source$.pipe(
      // tslint:disable-next-line:ban
      catchError(err => {
        /*
          display error in certain circumstances:
          typeof window === 'undefined' -- universal mode
          window.name !== 'nodejs' -- excludes display for jest
          process.env.DEBUG -- when environment explicitely wants it
          err instanceof Error -- i.e. TypeErrors that would be suppressed otherwise
         */
        if (typeof window === 'undefined' || window.name !== 'nodejs' || process.env.DEBUG || err instanceof Error) {
          console.error(err);
        }
        return of(new actionType({ error: HttpErrorMapper.fromError(err) }));
      })
    );
}

export function mapToProperty<T, K extends keyof T>(property: K) {
  return (source$: Observable<T>) => source$.pipe<T[K]>(map(x => (x ? x[property] : undefined)));
}
