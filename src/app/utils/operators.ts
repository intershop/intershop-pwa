import { Observable, of, OperatorFunction } from 'rxjs';
import { distinctUntilChanged, filter, map, partition, withLatestFrom } from 'rxjs/operators';

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
