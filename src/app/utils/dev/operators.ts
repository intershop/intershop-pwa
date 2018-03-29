import { OperatorFunction } from 'rxjs/interfaces';
import { Observable } from 'rxjs/Observable';
import { delay, tap } from 'rxjs/operators';

export function randomDelay<T>(min = 1000, max = 10000): OperatorFunction<T, T> {
  return function(source$: Observable<T>) {
    return source$.pipe(
      delay(Math.floor(Math.random() * (max - min + 1)) + min)
    );
  };
}

export function log<T>(message?: string): OperatorFunction<T, T> {
  return function(source$: Observable<T>): Observable<T> {
    return source$.pipe(
      tap(e => console.log(message || '', e))
    );
  };
}
