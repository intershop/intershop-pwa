import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action, Store, combineReducers } from '@ngrx/store';
import { cold, hot } from 'jest-marbles';
import { Observable, noop, of, throwError } from 'rxjs';
import { anyString, anything, instance, mock, verify, when } from 'ts-mockito';

import { BasketValidation } from 'ish-core/models/basket-validation/basket-validation.model';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { Product } from 'ish-core/models/product/product.model';
import { BasketService } from 'ish-core/services/basket/basket.service';
import { OrderService } from 'ish-core/services/order/order.service';
import { checkoutReducers } from 'ish-core/store/checkout/checkout-store.module';
import { coreReducers } from 'ish-core/store/core-store.module';
import { CreateOrder } from 'ish-core/store/orders';
import { LoadProductSuccess } from 'ish-core/store/shopping/products';
import { shoppingReducers } from 'ish-core/store/shopping/shopping-store.module';
import { BasketMockData } from 'ish-core/utils/dev/basket-mock-data';
import { ngrxTesting } from 'ish-core/utils/dev/ngrx-testing';

import { BasketValidationEffects } from './basket-validation.effects';
import * as basketActions from './basket.actions';

describe('Basket Validation Effects', () => {
  let actions$: Observable<Action>;
  let basketServiceMock: BasketService;
  let orderServiceMock: OrderService;
  let effects: BasketValidationEffects;
  let store$: Store<{}>;
  let location: Location;

  @Component({ template: 'dummy' })
  class DummyComponent {}

  beforeEach(() => {
    basketServiceMock = mock(BasketService);
    orderServiceMock = mock(OrderService);

    TestBed.configureTestingModule({
      declarations: [DummyComponent],
      imports: [
        RouterTestingModule.withRoutes([
          { path: 'checkout', children: [{ path: 'address', component: DummyComponent }] },
        ]),
        ngrxTesting({
          reducers: {
            ...coreReducers,
            shopping: combineReducers(shoppingReducers),
            checkout: combineReducers(checkoutReducers),
          },
        }),
      ],
      providers: [
        BasketValidationEffects,
        provideMockActions(() => actions$),
        { provide: BasketService, useFactory: () => instance(basketServiceMock) },
        { provide: OrderService, useFactory: () => instance(orderServiceMock) },
      ],
    });

    effects = TestBed.get(BasketValidationEffects);
    store$ = TestBed.get(Store);
    location = TestBed.get(Location);
  });

  describe('validateBasket$', () => {
    const basketValidation: BasketValidation = {
      basket: BasketMockData.getBasket(),
      results: {
        valid: true,
        adjusted: false,
      },
    };

    beforeEach(() => {
      when(basketServiceMock.validateBasket(anything(), anything())).thenReturn(of(basketValidation));

      store$.dispatch(
        new basketActions.LoadBasketSuccess({
          basket: BasketMockData.getBasket(),
        })
      );
      store$.dispatch(new LoadProductSuccess({ product: { sku: 'SKU' } as Product }));
    });

    it('should call the basketService for validateBasket', done => {
      const action = new basketActions.ValidateBasket({ scopes: ['Products'] });
      actions$ = of(action);

      effects.validateBasket$.subscribe(() => {
        verify(basketServiceMock.validateBasket(BasketMockData.getBasket().id, anything())).once();
        done();
      });
    });

    it('should map to action of type ContinueCheckoutSuccess', () => {
      const action = new basketActions.ValidateBasket({ scopes: ['Products'] });
      const completion = new basketActions.ContinueCheckoutSuccess({
        targetRoute: undefined,
        basketValidation,
      });
      actions$ = hot('-a', { a: action });
      const expected$ = cold('-c', { c: completion });

      expect(effects.validateBasket$).toBeObservable(expected$);
    });

    it('should map invalid request to action of type ContinueCheckoutFail', () => {
      when(basketServiceMock.validateBasket(anyString(), anything())).thenReturn(throwError({ message: 'invalid' }));

      const action = new basketActions.ValidateBasket({ scopes: ['Products'] });
      const completion = new basketActions.ContinueCheckoutFail({ error: { message: 'invalid' } as HttpError });
      actions$ = hot('-a', { a: action });
      const expected$ = cold('-c', { c: completion });

      expect(effects.validateBasket$).toBeObservable(expected$);
    });

    it('should map to action of type ContinueCheckoutWithIssues if basket is not valid', () => {
      const action = new basketActions.ValidateBasket({ scopes: ['Products'] });
      basketValidation.results.valid = false;
      const completion = new basketActions.ContinueCheckoutWithIssues({
        targetRoute: undefined,
        basketValidation,
      });
      actions$ = hot('-a', { a: action });
      const expected$ = cold('-c', { c: completion });

      expect(effects.validateBasket$).toBeObservable(expected$);
    });
  });

  describe('validateBasketAndContinueCheckout$', () => {
    const basketValidation: BasketValidation = {
      basket: BasketMockData.getBasket(),
      results: {
        valid: true,
        adjusted: false,
      },
    };

    beforeEach(() => {
      when(basketServiceMock.validateBasket(anything(), anything())).thenReturn(of(basketValidation));

      store$.dispatch(
        new basketActions.LoadBasketSuccess({
          basket: BasketMockData.getBasket(),
        })
      );
      store$.dispatch(new LoadProductSuccess({ product: { sku: 'SKU' } as Product }));
    });

    it('should call the basketService for validateBasketAndContinueCheckout', done => {
      const action = new basketActions.ContinueCheckout({ targetStep: 1 });
      actions$ = of(action);

      effects.validateBasketAndContinueCheckout$.subscribe(() => {
        verify(basketServiceMock.validateBasket(BasketMockData.getBasket().id, anything())).once();
        done();
      });
    });

    it('should map to action of type ContinueCheckoutSuccess if targetStep is not 5 (order creation)', () => {
      const action = new basketActions.ContinueCheckout({ targetStep: 1 });
      const completion = new basketActions.ContinueCheckoutSuccess({
        targetRoute: '/checkout/address',
        basketValidation,
      });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.validateBasketAndContinueCheckout$).toBeObservable(expected$);
    });

    it('should map to action of type CreateOrder if targetStep is 5 (order creation)', () => {
      const action = new basketActions.ContinueCheckout({ targetStep: 5 });
      const completion = new CreateOrder({ basketId: BasketMockData.getBasket().id });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.validateBasketAndContinueCheckout$).toBeObservable(expected$);
    });

    it('should map invalid request to action of type ContinueCheckoutFail', () => {
      when(basketServiceMock.validateBasket(anyString(), anything())).thenReturn(throwError({ message: 'invalid' }));

      const action = new basketActions.ContinueCheckout({ targetStep: 1 });
      const completion = new basketActions.ContinueCheckoutFail({ error: { message: 'invalid' } as HttpError });
      actions$ = hot('-a', { a: action });
      const expected$ = cold('-c', { c: completion });

      expect(effects.validateBasketAndContinueCheckout$).toBeObservable(expected$);
    });

    it('should navigate to the next checkout route after ContinueCheckoutSuccess if the basket is valid', fakeAsync(() => {
      const action = new basketActions.ContinueCheckoutSuccess({ targetRoute: '/checkout/address', basketValidation });
      actions$ = of(action);

      effects.jumpToNextCheckoutStep$.subscribe(noop, fail, noop);

      tick(500);

      expect(location.path()).toEqual('/checkout/address');
    }));

    it('should navigate to the error related route after ContinueCheckoutWithIssues if the basket is not valid', fakeAsync(() => {
      const basketValidationWithIssue: BasketValidation = {
        basket: BasketMockData.getBasket(),
        results: {
          valid: false,
          adjusted: false,
          errors: [{ code: '1234', message: 'error', parameters: { scopes: 'Addresses' } }],
        },
      };
      const action = new basketActions.ContinueCheckoutWithIssues({
        targetRoute: 'auto',
        basketValidation: basketValidationWithIssue,
      });
      actions$ = of(action);

      effects.jumpToNextCheckoutStep$.subscribe(noop, fail, noop);

      tick(500);

      expect(location.path()).toEqual('/checkout/address?error=true');
    }));

    it('should map to action of type ContinueCheckoutWithIssues if basket is not valid', () => {
      const action = new basketActions.ContinueCheckout({ targetStep: 1 });
      basketValidation.results.valid = false;
      const completion = new basketActions.ContinueCheckoutWithIssues({
        targetRoute: '/checkout/address',
        basketValidation,
      });
      actions$ = hot('-a', { a: action });
      const expected$ = cold('-c', { c: completion });

      expect(effects.validateBasketAndContinueCheckout$).toBeObservable(expected$);
    });
  });
});
