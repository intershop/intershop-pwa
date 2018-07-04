import { Observable, of, OperatorFunction } from 'rxjs';
import { distinctUntilChanged, filter, map, partition, withLatestFrom } from 'rxjs/operators';

export interface Partiton<T> {
  isTrue: Observable<T>;
  isFalse: Observable<T>;
}

export function partitionBy<T>(predicate: (value: T) => boolean): OperatorFunction<T, Partiton<T>> {
  return (source$: Observable<T>) =>
    source$.pipe(
      inp => of(partition(predicate)(inp)),
      map(([a, b]) => ({ isTrue: a, isFalse: b }))
    );
}

export function distinctCompareWith<T>(observable: Observable<T>): OperatorFunction<T, T> {
  return (source$: Observable<T>) =>
    source$.pipe(
      withLatestFrom(observable),
      filter(([newVal, oldVal]) => newVal !== oldVal),
      map(([newVal]) => newVal),
      distinctUntilChanged()
    );
}
