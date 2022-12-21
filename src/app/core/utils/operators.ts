import { ofType } from '@ngrx/effects';
import { Action, ActionCreator } from '@ngrx/store';
import {
  MonoTypeOperatorFunction,
  NEVER,
  Observable,
  OperatorFunction,
  combineLatest,
  concat,
  connect,
  of,
  throwError,
} from 'rxjs';
import { buffer, catchError, distinctUntilChanged, filter, map, mergeAll, take, withLatestFrom } from 'rxjs/operators';

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
          return throwError(() => error);
        }
        const errorAction = actionType({ error, ...extras });
        return of(errorAction);
      })
    );
}

export function mapToProperty<T, K extends keyof T>(property: K) {
  return (source$: Observable<T>) => source$.pipe<T[K]>(map(x => (x ? x[property] : undefined)));
}

export function mapToPayload<T>(): OperatorFunction<{ payload: T } & Action, T> {
  return (source$: Observable<{ payload: T }>) => source$.pipe(map(action => action.payload));
}

export function mapToPayloadProperty<T, K extends keyof T>(key: K): OperatorFunction<{ payload: T } & Action, T[K]> {
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
 * Operator that maps to an observable when the stream contains the specified action.
 * Uses combineLatest so it will emit after both the action is fired and the observable emits.
 *
 * @param observable$ the observable that will be mapped to
 * @param action the action to listen for
 * @returns a stream containing only the values of the provided observable
 */
export function useCombinedObservableOnAction<T>(
  observable$: Observable<T>,
  action: ActionCreator
): OperatorFunction<Action, T> {
  return (source$: Observable<Action>) =>
    combineLatest([observable$, source$.pipe(ofType(action))]).pipe(map(([obs, _]) => obs));
}

/**
 * Delays emissions until the notifier emits.
 * Taken from https://ncjamieson.com/how-to-write-delayuntil/
 *
 * @param notifier the observable that will be waited for
 * @returns an observable that starts emitting only after the notifier emits
 */
export function delayUntil<T>(notifier: Observable<unknown>): OperatorFunction<T, T> {
  return source =>
    source.pipe(
      connect(connected => concat(concat(connected, NEVER).pipe(buffer(notifier), take(1), mergeAll()), connected))
    );
}
