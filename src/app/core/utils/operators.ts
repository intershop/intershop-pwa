import { MonoTypeOperatorFunction, Observable, OperatorFunction, of, throwError } from 'rxjs';
import { catchError, distinctUntilChanged, filter, map, withLatestFrom } from 'rxjs/operators';

import { HttpError } from 'ish-core/models/http-error/http-error.model';

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

export function mapErrorToAction<S, T>(actionType: (props: { error: HttpError }) => T, extras?: object) {
  return (source$: Observable<S | T>) =>
    source$.pipe(
      catchError((error: HttpError) => {
        if (error.name !== 'HttpErrorResponse') {
          // rethrow runtime errors
          return throwError(error);
        }
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
          (typeof process !== 'undefined' && process.env.DEBUG)
        ) {
          console.error(error);
        }
        const errorAction = actionType({ error, ...extras });
        return of(errorAction);
      })
    );
}

export function mapToProperty<T, K extends keyof T>(property: K) {
  return (source$: Observable<T>) => source$.pipe<T[K]>(map(x => (x ? x[property] : undefined)));
}

export function mapToPayload<T>(): OperatorFunction<{ payload: T; type: unknown }, T> {
  return (source$: Observable<{ payload: T }>) => source$.pipe(map(action => action.payload));
}

export function mapToPayloadProperty<T>(key: keyof T): OperatorFunction<{ payload: T; type: unknown }, T[keyof T]> {
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

/**
 * Operator waiting for a specific feature store to be initialized.
 *
 * Use in services to prevent warnings like:
 * @ngrx/store: The feature name "XXX" does not exist in the state, therefore createFeatureSelector cannot access it.
 */
export function waitForFeatureStore(name: string): MonoTypeOperatorFunction<{}> {
  return (source$: Observable<{}>) => source$.pipe(filter(x => !!x && !!x[name]));
}
