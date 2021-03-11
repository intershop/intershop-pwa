import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action, Store } from '@ngrx/store';
import { cold, hot } from 'jest-marbles';
import { Observable, of, throwError } from 'rxjs';
import { instance, mock, verify, when } from 'ts-mockito';

import { Basket } from 'ish-core/models/basket/basket.model';
import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { displayErrorMessage } from 'ish-core/store/core/messages';
import { loadBasketSuccess } from 'ish-core/store/customer/basket';
import { makeHttpError } from 'ish-core/utils/dev/api-service-utils';

import { PunchoutService } from '../../services/punchout/punchout.service';

import {
  transferPunchoutBasket,
  transferPunchoutBasketFail,
  transferPunchoutBasketSuccess,
} from './punchout-functions.actions';
import { PunchoutFunctionsEffects } from './punchout-functions.effects';

describe('Punchout Functions Effects', () => {
  let actions$: Observable<Action>;
  let effects: PunchoutFunctionsEffects;
  let punchoutService: PunchoutService;
  let store$: Store;

  beforeEach(() => {
    punchoutService = mock(PunchoutService);
    when(punchoutService.transferPunchoutBasket()).thenReturn(of(undefined));

    TestBed.configureTestingModule({
      imports: [CoreStoreModule.forTesting([])],
      providers: [
        PunchoutFunctionsEffects,
        provideMockActions(() => actions$),
        { provide: PunchoutService, useFactory: () => instance(punchoutService) },
      ],
    });

    effects = TestBed.inject(PunchoutFunctionsEffects);
    store$ = TestBed.inject(Store);
  });

  describe('transferPunchoutBasket$', () => {
    beforeEach(() => {
      store$.dispatch(
        loadBasketSuccess({
          basket: {
            id: 'BID',
            lineItems: [],
          } as Basket,
        })
      );
    });

    it('should call the service for transfering the punchout data', done => {
      actions$ = of(transferPunchoutBasket());

      effects.transferPunchoutBasket$.subscribe(() => {
        verify(punchoutService.transferPunchoutBasket()).once();
        done();
      });
    });

    it('should map to action of type transferPunchoutBasketSuccess', () => {
      const action = transferPunchoutBasket();

      const completion = transferPunchoutBasketSuccess();

      actions$ = hot('-a', { a: action });
      const expected$ = cold('-b', { b: completion });

      expect(effects.transferPunchoutBasket$).toBeObservable(expected$);
    });

    it('should dispatch a transferPunchoutBasketFail action in case of an error', () => {
      const error = makeHttpError({ status: 401, code: 'feld' });
      when(punchoutService.transferPunchoutBasket()).thenReturn(throwError(error));

      const action = transferPunchoutBasket();
      const completion = transferPunchoutBasketFail({ error });

      actions$ = hot('-a', { a: action });
      const expected$ = cold('-b', { b: completion });

      expect(effects.transferPunchoutBasket$).toBeObservable(expected$);
    });

    it('should map to action of type DisplayErrorMessage in case of an error', () => {
      const error = makeHttpError({ status: 401, code: 'feld', message: 'e-message' });

      const action = transferPunchoutBasketFail({ error });

      const completion = displayErrorMessage({
        message: 'e-message',
      });

      actions$ = hot('-a', { a: action });
      const expected$ = cold('-b', { b: completion });

      expect(effects.displayPunchoutErrorMessage$).toBeObservable(expected$);
    });
  });
});
