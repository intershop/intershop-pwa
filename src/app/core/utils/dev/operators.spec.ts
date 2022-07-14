import { cold, hot } from 'jasmine-marbles';
import { Subject, noop } from 'rxjs';

import { log } from './operators';

describe('Operators', () => {
  /* eslint-disable no-console */
  describe('log', () => {
    let subject$: Subject<string>;

    beforeEach(() => {
      jest.spyOn(console, 'log').mockImplementation(noop);
      subject$ = new Subject();
    });

    it('should call console.log with custom message for each emitted value', done => {
      subject$.pipe(log('message')).subscribe({
        next: noop,
        error: fail,
        complete: () => {
          expect(console.log).toHaveBeenCalledTimes(3);
          done();
        },
      });

      subject$.next('a');
      expect(console.log).toHaveBeenCalledWith('message', 'a');

      subject$.next('b');
      subject$.next('c');

      subject$.complete();
    });

    it('should leave message blank if none given', done => {
      subject$.pipe(log()).subscribe(() => {
        expect(console.log).toHaveBeenCalledWith('', 'a');
        done();
      });

      subject$.next('a');
    });

    it('should execute message if it is a function', done => {
      subject$.pipe(log(() => 1234)).subscribe(() => {
        expect(console.log).toHaveBeenCalledWith(1234, 'a');
        done();
      });

      subject$.next('a');
    });

    it('should leave emitted values for stream unchanged', done => {
      subject$.pipe(log()).subscribe(e => {
        expect(e).toEqual('a');
        done();
      });

      subject$.next('a');
    });

    it('should leave emitted values for stream unchanged (marble test)', () => {
      const source$ = hot('-a-a-bc---|');
      const piped$ = source$.pipe(log());
      const expected$ = cold('-a-a-bc---|');

      expect(piped$).toBeObservable(expected$);
    });
  });
});
