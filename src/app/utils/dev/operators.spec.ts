// tslint:disable:use-async-synchronisation-in-tests
import { cold, hot } from 'jest-marbles';
import { Subject } from 'rxjs';
import { log } from './operators';

describe('Operators', () => {
  describe('log', () => {
    let subject$: Subject<string>;

    beforeEach(() => {
      // tslint:disable-next-line:ban
      spyOn(console, 'log');
      subject$ = new Subject<string>();
    });

    it('should call console.log with custom message for each emitted value', () => {
      // tslint:disable-next-line:no-empty
      subject$.pipe(log('message')).subscribe(() => {});

      subject$.next('a');
      expect(console.log).toHaveBeenCalledWith('message', 'a');

      subject$.next('b');
      subject$.next('c');

      expect(console.log).toHaveBeenCalledTimes(3);
    });

    it('should leave message blank if none given', () => {
      // tslint:disable-next-line:no-empty
      subject$.pipe(log()).subscribe(() => {});

      subject$.next('a');
      expect(console.log).toHaveBeenCalledWith('', 'a');
    });

    it('should leave emitted values for stream unchanged', () => {
      let result;
      subject$.pipe(log()).subscribe(e => (result = e));

      subject$.next('a');
      expect(result).toEqual('a');

      subject$.next('b');
      expect(result).toEqual('b');
    });

    it('should leave emitted values for stream unchanged (marble test)', () => {
      const source$ = hot('-a-a-bc', { a: 'a', b: 'b', c: 'c' });
      const piped$ = source$.pipe(log());
      const expected$ = cold('-a-a-bc', { a: 'a', b: 'b', c: 'c' });

      expect(piped$).toBeObservable(expected$);
    });
  });
});
