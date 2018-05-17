import { Observable, OperatorFunction } from 'rxjs';
import { delay, tap } from 'rxjs/operators';

export function randomDelay<T>(min = 1000, max = 10000): OperatorFunction<T, T> {
  return function(source$: Observable<T>) {
    return source$.pipe(delay(Math.floor(Math.random() * (max - min + 1)) + min));
  };
}

export function log<T>(message?: string, stringify?: boolean): OperatorFunction<T, T> {
  return function(source$: Observable<T>): Observable<T> {
    return source$.pipe(tap(e => console.log(message || '', stringify ? JSON.stringify(e) : e)));
  };
}
