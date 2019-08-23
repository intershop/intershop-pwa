import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action, Store, StoreModule, combineReducers } from '@ngrx/store';
import { cold, hot } from 'jest-marbles';
import { Observable, of, throwError } from 'rxjs';
import { anyString, instance, mock, verify, when } from 'ts-mockito';

import { Basket } from 'ish-core/models/basket/basket.model';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { coreReducers } from 'ish-core/store/core-store.module';
import { BasketService } from '../../../services/basket/basket.service';
import { shoppingReducers } from '../../shopping/shopping-store.module';
import { checkoutReducers } from '../checkout-store.module';

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
        StoreModule.forRoot({
          ...coreReducers,
          shopping: combineReducers(shoppingReducers),
          checkout: combineReducers(checkoutReducers),
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
        verify(basketServiceMock.addPromotionCodeToBasket('CODE', 'BID')).once();
        done();
      });
    });

    it('should map to action of type AddPromotionCodeToBasketSuccess', () => {
      const code = 'CODE';
      const action = new basketActions.AddPromotionCodeToBasket({ code });
      const completion = new basketActions.AddPromotionCodeToBasketSuccess({
        message: 'shopping_cart.promotion.qualified_promo.text',
      });
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

  describe('loadBasketAfterAddPromotionCodeToBasket$', () => {
    it('should map to action of type LoadBasket if AddPromotionCodeToBasketSuccess action triggered', () => {
      const action = new basketActions.AddPromotionCodeToBasketSuccess({
        message: 'shopping_cart.promotion.qualified_promo.text',
      });
      const completion = new basketActions.LoadBasket();
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadBasketAfterAddPromotionCodeToBasketChangeSuccess$).toBeObservable(expected$);
    });
  });
});
