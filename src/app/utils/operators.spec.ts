import { cold, hot } from 'jasmine-marbles';
import { of } from 'rxjs';
import { distinctCompareWith } from './operators';

describe('Operators', () => {
  describe('distinctCompareWith', () => {
    it('should fire only when stream value is different than constant compare value and value is changed', () => {
      const compare$ = of('a');
      const input$ = hot('a-b-b-a-a-a-b-c-a-a');
      const expt$ = cold('--b-----------c----');

      expect(input$.pipe(distinctCompareWith(compare$))).toBeObservable(expt$);
    });

    it('should fire only when stream value is different than flexible compare value and value is changed', () => {
      const compa$ = hot('--a-b-b-a-a-a-b-c-a');
      const input$ = hot('a-b-b-a-a-a-b-c-a-a');
      const expt$ = cold('--b---a-----b-c-a--');

      expect(input$.pipe(distinctCompareWith(compa$))).toBeObservable(expt$);
    });
  });
});
