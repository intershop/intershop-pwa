import { cold, getTestScheduler, hot } from 'jasmine-marbles';
import { merge, Observable, of } from 'rxjs';
import { concatMap, delay, filter, last, mapTo } from 'rxjs/operators';
import { distinctCompareWith, Partition, partitionBy } from './operators';

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

  describe('partitionBy', () => {
    describe('merge usage', () => {
      it('should always split input into two streams', () => {
        const input$ = hot('1-2-3-4-5-6-7-8-9--|') as Observable<number>;
        const resu$ = cold('--X-Y-X--5X--7X--9-C|');

        const output$ = input$.pipe(
          partitionBy(num => num % 2 === 0),
          concatMap(part =>
            merge(
              part.isTrue.pipe(mapTo('X')),
              part.isFalse.pipe(
                delay(10, getTestScheduler()),
                filter(x => x > 4)
              ),
              part.isTrue.pipe(
                last(),
                mapTo('C')
              ),
              of('Y').pipe(delay(40, getTestScheduler()))
            )
          )
        );

        expect(output$).toBeObservable(resu$);
      });
    });

    describe('local variable usage', () => {
      let partition$: Observable<Partition<number>>;

      beforeEach(() => {
        const input$ = hot('1-2-3-4-5-6-7-8-9--|') as Observable<number>;
        partition$ = input$.pipe(partitionBy(x => x % 2 === 0));
      });

      it('should fire when true path emits', () => {
        const output$ = partition$.pipe(concatMap(part => part.isTrue));
        expect(output$).toBeObservable(cold('--2---4---6---8----|'));
      });

      it('should fire when false path emits', () => {
        const output$ = partition$.pipe(
          concatMap(part => part.isFalse),
          mapTo('X')
        );
        expect(output$).toBeObservable(cold('X---X---X---X---X--|'));
      });
    });
  });
});
