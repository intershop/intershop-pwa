import { HttpErrorResponse } from '@angular/common/http';
import { MonoTypeOperatorFunction, Observable, OperatorFunction, of } from 'rxjs';
import { catchError, distinctUntilChanged, filter, map, withLatestFrom } from 'rxjs/operators';

import { HttpErrorMapper } from 'ish-core/models/http-error/http-error.mapper';
import { HttpError } from 'ish-core/models/http-error/http-error.model';

export interface Partition<T> {
  isTrue: Observable<T>;
  isFalse: Observable<T>;
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

// tslint:disable-next-line:no-any
export function mapErrorToAction<S, T>(actionType: new (error: { error: HttpError }) => T, extras?: any) {
  return (source$: Observable<S | T>) =>
    source$.pipe(
      // tslint:disable-next-line:ban ban-types
      catchError((err: HttpErrorResponse) => {
        /*
          display error in certain circumstances:
          typeof window === 'undefined' -- universal mode
          !process.env.JEST_WORKER_ID -- excludes display for jest
          process.env.DEBUG -- when environment explicitely wants it
          err instanceof Error -- i.e. TypeErrors that would be suppressed otherwise
         */
        if (
          typeof window === 'undefined' ||
          (typeof process !== 'undefined' && !process.env.JEST_WORKER_ID) ||
          (typeof process !== 'undefined' && process.env.DEBUG) ||
          err instanceof Error
        ) {
          console.error(err);
        }
        const errorAction = new actionType({ error: HttpErrorMapper.fromError(err), ...extras });
        return of(errorAction);
      })
    );
}

export function mapToProperty<T, K extends keyof T>(property: K) {
  return (source$: Observable<T>) => source$.pipe<T[K]>(map(x => (x ? x[property] : undefined)));
}

// tslint:disable-next-line:no-any
export function mapToPayload<T>(): OperatorFunction<{ payload: T; type: any }, T> {
  return (source$: Observable<{ payload: T }>) => source$.pipe(map(action => action.payload));
}

// tslint:disable-next-line:no-any
export function mapToPayloadProperty<T>(key: keyof T): OperatorFunction<{ payload: T; type: any }, T[keyof T]> {
  return (source$: Observable<{ payload: T }>) =>
    source$.pipe(
      map(action => action.payload),
      mapToProperty(key)
    );
}

export function whenTruthy<T>(): MonoTypeOperatorFunction<T> {
  return (source$: Observable<T>) => source$.pipe(filter(x => !!x));
}

export function whenFalsy<T>(): MonoTypeOperatorFunction<T> {
  return (source$: Observable<T>) => source$.pipe(filter(x => !x));
}
