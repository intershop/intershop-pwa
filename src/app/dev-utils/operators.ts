import { Observable } from 'rxjs/Observable';
import { delay, tap } from 'rxjs/operators';

export const log = (message?: string) =>
  tap(e => console.log(message || '', e));


export const randomDelay = <T>(min = 1000, max = 10000) =>
  (source: Observable<T>) => source.pipe(
    delay(Math.floor(Math.random() * (max - min + 1)) + min)
  );
