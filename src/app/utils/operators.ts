import { Observable, of, OperatorFunction } from 'rxjs';
import { map, partition } from 'rxjs/operators';

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
