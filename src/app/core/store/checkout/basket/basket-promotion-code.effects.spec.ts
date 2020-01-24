import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action, Store, combineReducers } from '@ngrx/store';
import { cold, hot } from 'jest-marbles';
import { Observable, of, throwError } from 'rxjs';
import { anyString, instance, mock, verify, when } from 'ts-mockito';

import { Basket } from 'ish-core/models/basket/basket.model';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { BasketService } from 'ish-core/services/basket/basket.service';
import { checkoutReducers } from 'ish-core/store/checkout/checkout-store.module';
import { coreReducers } from 'ish-core/store/core-store.module';
import { shoppingReducers } from 'ish-core/store/shopping/shopping-store.module';
import { ngrxTesting } from 'ish-core/utils/dev/ngrx-testing';

import { BasketPromotionCodeEffects } from './basket-promotion-code.effects';
import * as basketActions from './basket.actions';

describe('Basket Promotion Code Effects', () => {
  let actions$: Observable<Action>;
  let basketServiceMock: BasketService;
  let effects: BasketPromotionCodeEffects;
  let store$: Store<{}>;

  beforeEach(() => {
    basketServiceMock = mock(BasketService);
    TestBed.configureTestingModule({
      imports: [
        ngrxTesting({
          reducers: {
            ...coreReducers,
            shopping: combineReducers(shoppingReducers),
            checkout: combineReducers(checkoutReducers),
          },
        }),
      ],
      providers: [
        BasketPromotionCodeEffects,
        provideMockActions(() => actions$),
        { provide: BasketService, useFactory: () => instance(basketServiceMock) },
      ],
    });

    effects = TestBed.get(BasketPromotionCodeEffects);
    store$ = TestBed.get(Store);
  });

  describe('loadBasketAfterAddPromotionCodeToBasket$', () => {
    it('should map to action of type LoadBasket if AddPromotionCodeToBasketSuccess action triggered', () => {
      const action = new basketActions.AddPromotionCodeToBasketSuccess();
      const completion = new basketActions.LoadBasket();
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadBasketAfterAddPromotionCodeToBasketChangeSuccess$).toBeObservable(expected$);
    });
  });

  describe('addPromotionCodeToBasket$', () => {
    beforeEach(() => {
      when(basketServiceMock.addPromotionCodeToBasket(anyString(), anyString())).thenReturn(of(undefined));

      store$.dispatch(
        new basketActions.LoadBasketSuccess({
          basket: {
            id: 'BID',
            lineItems: [],
          } as Basket,
        })
      );
    });

    it('should call the basketService for AddPromotionCodeToBasket action', done => {
      const code = 'CODE';
      const action = new basketActions.AddPromotionCodeToBasket({ code });
      actions$ = of(action);

      effects.addPromotionCodeToBasket$.subscribe(() => {
        verify(basketServiceMock.addPromotionCodeToBasket('BID', 'CODE')).once();
        done();
      });
    });

    it('should map to action of type AddPromotionCodeToBasketSuccess', () => {
      const code = 'CODE';
      const action = new basketActions.AddPromotionCodeToBasket({ code });
      const completion = new basketActions.AddPromotionCodeToBasketSuccess();
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.addPromotionCodeToBasket$).toBeObservable(expected$);
    });

    it('should map invalid request to action of type AddPromotionCodeToBasketFail', () => {
      when(basketServiceMock.addPromotionCodeToBasket(anyString(), anyString())).thenReturn(
        throwError({ message: 'invalid' })
      );

      const code = 'CODE';
      const action = new basketActions.AddPromotionCodeToBasket({ code });
      const completion = new basketActions.AddPromotionCodeToBasketFail({ error: { message: 'invalid' } as HttpError });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.addPromotionCodeToBasket$).toBeObservable(expected$);
    });
  });

  describe('removePromotionCodeFromBasket$', () => {
    beforeEach(() => {
      when(basketServiceMock.removePromotionCodeFromBasket(anyString(), anyString())).thenReturn(of(undefined));

      store$.dispatch(
        new basketActions.LoadBasketSuccess({
          basket: {
            id: 'BID',
            lineItems: [],
          } as Basket,
        })
      );
    });

    it('should call the basketService for RemovePromotionCodeFromBasket action', done => {
      const code = 'CODE';
      const action = new basketActions.RemovePromotionCodeFromBasket({ code });
      actions$ = of(action);

      effects.removePromotionCodeFromBasket$.subscribe(() => {
        verify(basketServiceMock.removePromotionCodeFromBasket('BID', 'CODE')).once();
        done();
      });
    });

    it('should map to action of type RemovePromotionCodeFromBasketSuccess', () => {
      const code = 'CODE';
      const action = new basketActions.RemovePromotionCodeFromBasket({ code });
      const completion = new basketActions.RemovePromotionCodeFromBasketSuccess();
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.removePromotionCodeFromBasket$).toBeObservable(expected$);
    });

    it('should map invalid request to action of type RemovePromotionCodeFromBasketFail', () => {
      when(basketServiceMock.removePromotionCodeFromBasket(anyString(), anyString())).thenReturn(
        throwError({ message: 'invalid' })
      );

      const code = 'CODE';
      const action = new basketActions.RemovePromotionCodeFromBasket({ code });
      const completion = new basketActions.RemovePromotionCodeFromBasketFail({
        error: { message: 'invalid' } as HttpError,
      });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.removePromotionCodeFromBasket$).toBeObservable(expected$);
    });
  });

  describe('loadBasketAfterRemovePromotionCodeFromBasket$', () => {
    it('should map to action of type LoadBasket if RemovePromotionCodeFromBasketSuccess action triggered', () => {
      const action = new basketActions.RemovePromotionCodeFromBasketSuccess();
      const completion = new basketActions.LoadBasket();
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadBasketAfterRemovePromotionCodeFromBasketChangeSuccess$).toBeObservable(expected$);
    });
  });
});
