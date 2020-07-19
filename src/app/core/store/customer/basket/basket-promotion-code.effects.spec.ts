import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action, Store } from '@ngrx/store';
import { cold, hot } from 'jest-marbles';
import { Observable, of, throwError } from 'rxjs';
import { anyString, instance, mock, verify, when } from 'ts-mockito';

import { Basket } from 'ish-core/models/basket/basket.model';
import { BasketService } from 'ish-core/services/basket/basket.service';
import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { CustomerStoreModule } from 'ish-core/store/customer/customer-store.module';
import { ShoppingStoreModule } from 'ish-core/store/shopping/shopping-store.module';
import { makeHttpError } from 'ish-core/utils/dev/api-service-utils';

import { BasketPromotionCodeEffects } from './basket-promotion-code.effects';
import {
  addPromotionCodeToBasket,
  addPromotionCodeToBasketFail,
  addPromotionCodeToBasketSuccess,
  loadBasket,
  loadBasketSuccess,
  removePromotionCodeFromBasket,
  removePromotionCodeFromBasketFail,
  removePromotionCodeFromBasketSuccess,
} from './basket.actions';

describe('Basket Promotion Code Effects', () => {
  let actions$: Observable<Action>;
  let basketServiceMock: BasketService;
  let effects: BasketPromotionCodeEffects;
  let store$: Store;

  beforeEach(() => {
    basketServiceMock = mock(BasketService);
    TestBed.configureTestingModule({
      imports: [
        CoreStoreModule.forTesting(),
        CustomerStoreModule.forTesting('basket'),
        ShoppingStoreModule.forTesting('promotions'),
      ],
      providers: [
        BasketPromotionCodeEffects,
        provideMockActions(() => actions$),
        { provide: BasketService, useFactory: () => instance(basketServiceMock) },
      ],
    });

    effects = TestBed.inject(BasketPromotionCodeEffects);
    store$ = TestBed.inject(Store);
  });

  describe('loadBasketAfterAddPromotionCodeToBasket$', () => {
    it('should map to action of type LoadBasket if AddPromotionCodeToBasketSuccess action triggered', () => {
      const action = addPromotionCodeToBasketSuccess();
      const completion = loadBasket();
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadBasketAfterAddPromotionCodeToBasketChangeSuccess$).toBeObservable(expected$);
    });
  });

  describe('addPromotionCodeToBasket$', () => {
    beforeEach(() => {
      when(basketServiceMock.addPromotionCodeToBasket(anyString(), anyString())).thenReturn(of(undefined));

      store$.dispatch(
        loadBasketSuccess({
          basket: {
            id: 'BID',
            lineItems: [],
          } as Basket,
        })
      );
    });

    it('should call the basketService for AddPromotionCodeToBasket action', done => {
      const code = 'CODE';
      const action = addPromotionCodeToBasket({ code });
      actions$ = of(action);

      effects.addPromotionCodeToBasket$.subscribe(() => {
        verify(basketServiceMock.addPromotionCodeToBasket('BID', 'CODE')).once();
        done();
      });
    });

    it('should map to action of type AddPromotionCodeToBasketSuccess', () => {
      const code = 'CODE';
      const action = addPromotionCodeToBasket({ code });
      const completion = addPromotionCodeToBasketSuccess();
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.addPromotionCodeToBasket$).toBeObservable(expected$);
    });

    it('should map invalid request to action of type AddPromotionCodeToBasketFail', () => {
      when(basketServiceMock.addPromotionCodeToBasket(anyString(), anyString())).thenReturn(
        throwError(makeHttpError({ message: 'invalid' }))
      );

      const code = 'CODE';
      const action = addPromotionCodeToBasket({ code });
      const completion = addPromotionCodeToBasketFail({ error: makeHttpError({ message: 'invalid' }) });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.addPromotionCodeToBasket$).toBeObservable(expected$);
    });
  });

  describe('removePromotionCodeFromBasket$', () => {
    beforeEach(() => {
      when(basketServiceMock.removePromotionCodeFromBasket(anyString(), anyString())).thenReturn(of(undefined));

      store$.dispatch(
        loadBasketSuccess({
          basket: {
            id: 'BID',
            lineItems: [],
          } as Basket,
        })
      );
    });

    it('should call the basketService for RemovePromotionCodeFromBasket action', done => {
      const code = 'CODE';
      const action = removePromotionCodeFromBasket({ code });
      actions$ = of(action);

      effects.removePromotionCodeFromBasket$.subscribe(() => {
        verify(basketServiceMock.removePromotionCodeFromBasket('BID', 'CODE')).once();
        done();
      });
    });

    it('should map to action of type RemovePromotionCodeFromBasketSuccess', () => {
      const code = 'CODE';
      const action = removePromotionCodeFromBasket({ code });
      const completion = removePromotionCodeFromBasketSuccess();
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.removePromotionCodeFromBasket$).toBeObservable(expected$);
    });

    it('should map invalid request to action of type RemovePromotionCodeFromBasketFail', () => {
      when(basketServiceMock.removePromotionCodeFromBasket(anyString(), anyString())).thenReturn(
        throwError(makeHttpError({ message: 'invalid' }))
      );

      const code = 'CODE';
      const action = removePromotionCodeFromBasket({ code });
      const completion = removePromotionCodeFromBasketFail({
        error: makeHttpError({ message: 'invalid' }),
      });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.removePromotionCodeFromBasket$).toBeObservable(expected$);
    });
  });

  describe('loadBasketAfterRemovePromotionCodeFromBasket$', () => {
    it('should map to action of type LoadBasket if RemovePromotionCodeFromBasketSuccess action triggered', () => {
      const action = removePromotionCodeFromBasketSuccess();
      const completion = loadBasket();
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadBasketAfterRemovePromotionCodeFromBasketChangeSuccess$).toBeObservable(expected$);
    });
  });
});
