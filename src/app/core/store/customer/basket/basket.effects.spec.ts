import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action, Store } from '@ngrx/store';
import { cold, hot } from 'jest-marbles';
import { EMPTY, Observable, of, throwError } from 'rxjs';
import { anyString, anything, instance, mock, verify, when } from 'ts-mockito';

import { BasketBaseData } from 'ish-core/models/basket/basket.interface';
import { Basket } from 'ish-core/models/basket/basket.model';
import { Credentials } from 'ish-core/models/credentials/credentials.model';
import { Customer } from 'ish-core/models/customer/customer.model';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { LineItem } from 'ish-core/models/line-item/line-item.model';
import { Product, ProductCompletenessLevel } from 'ish-core/models/product/product.model';
import { BasketService } from 'ish-core/services/basket/basket.service';
import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { CustomerStoreModule } from 'ish-core/store/customer/customer-store.module';
import { LoginUser, LoginUserSuccess, SetAPIToken } from 'ish-core/store/customer/user';
import { LoadProductIfNotLoaded, LoadProductSuccess } from 'ish-core/store/shopping/products';
import { ShoppingStoreModule } from 'ish-core/store/shopping/shopping-store.module';
import { BasketMockData } from 'ish-core/utils/dev/basket-mock-data';

import {
  LoadBasket,
  LoadBasketByAPIToken,
  LoadBasketEligibleShippingMethods,
  LoadBasketEligibleShippingMethodsFail,
  LoadBasketEligibleShippingMethodsSuccess,
  LoadBasketFail,
  LoadBasketSuccess,
  MergeBasket,
  MergeBasketFail,
  MergeBasketSuccess,
  ResetBasketErrors,
  UpdateBasket,
  UpdateBasketFail,
  UpdateBasketShippingMethod,
} from './basket.actions';
import { BasketEffects } from './basket.effects';

describe('Basket Effects', () => {
  let actions$: Observable<Action>;
  let basketServiceMock: BasketService;
  let effects: BasketEffects;
  let store$: Store;
  let router: Router;

  beforeEach(() => {
    basketServiceMock = mock(BasketService);

    @Component({ template: 'dummy' })
    class DummyComponent {}

    TestBed.configureTestingModule({
      declarations: [DummyComponent],
      imports: [
        CoreStoreModule.forTesting(['router']),
        CustomerStoreModule.forTesting('user', 'basket'),
        RouterTestingModule.withRoutes([{ path: '**', component: DummyComponent }]),
        ShoppingStoreModule.forTesting('products', 'categories'),
      ],
      providers: [
        BasketEffects,
        provideMockActions(() => actions$),
        { provide: BasketService, useFactory: () => instance(basketServiceMock) },
      ],
    });

    effects = TestBed.inject(BasketEffects);
    store$ = TestBed.inject(Store);
    router = TestBed.inject(Router);
  });

  describe('loadBasket$', () => {
    beforeEach(() => {
      when(basketServiceMock.getBasket()).thenCall(() => of({ id: 'BID' } as Basket));
    });

    it('should call the basketService for loadBasket', done => {
      const action = new LoadBasket();
      actions$ = of(action);

      effects.loadBasket$.subscribe(() => {
        verify(basketServiceMock.getBasket()).once();
        done();
      });
    });

    it('should map to action of type LoadBasketSuccess', () => {
      const id = 'BID';
      const action = new LoadBasket();
      const completion = new LoadBasketSuccess({ basket: { id } as Basket });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadBasket$).toBeObservable(expected$);
    });

    it('should map invalid request to action of type LoadBasketFail', () => {
      when(basketServiceMock.getBasket()).thenReturn(throwError({ message: 'invalid' }));
      const action = new LoadBasket();
      const completion = new LoadBasketFail({ error: { message: 'invalid' } as HttpError });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadBasket$).toBeObservable(expected$);
    });
  });

  describe('loadBasketByAPIToken$', () => {
    it('should call the basket service on LoadUserByAPIToken action and load user on success', done => {
      when(basketServiceMock.getBasketByToken('dummy')).thenReturn(of({ id: 'basket' } as Basket));

      actions$ = of(new LoadBasketByAPIToken({ apiToken: 'dummy' }));

      effects.loadBasketByAPIToken$.subscribe(action => {
        verify(basketServiceMock.getBasketByToken('dummy')).once();
        expect(action).toMatchInlineSnapshot(`
          [Basket API] Load Basket Success:
            basket: {"id":"basket"}
        `);
        done();
      });
    });

    it('should call the basket service on LoadUserByAPIToken action and do nothing when failing', () => {
      when(basketServiceMock.getBasketByToken('dummy')).thenReturn(EMPTY);

      actions$ = hot('a-a-a-', { a: new LoadBasketByAPIToken({ apiToken: 'dummy' }) });

      expect(effects.loadBasketByAPIToken$).toBeObservable(cold('------'));
    });
  });

  describe('loadProductsForBasket$', () => {
    it('should trigger product loading actions for line items if LoadBasketSuccess action triggered', () => {
      when(basketServiceMock.getBasket()).thenReturn(of());

      const action = new LoadBasketSuccess({
        basket: {
          id: 'BID',
          lineItems: [
            {
              id: 'BIID',
              name: 'NAME',
              position: 1,
              quantity: { value: 1 },
              price: undefined,
              productSKU: 'SKU',
            } as LineItem,
          ],
          payment: undefined,
        } as Basket,
      });

      const completion = new LoadProductIfNotLoaded({ sku: 'SKU', level: ProductCompletenessLevel.List });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadProductsForBasket$).toBeObservable(expected$);
    });
    it('should trigger product loading actions for line items if MergeBasketSuccess action triggered', () => {
      when(basketServiceMock.getBasket()).thenReturn(of());

      const action = new MergeBasketSuccess({
        basket: {
          id: 'BID',
          lineItems: [
            {
              id: 'BIID',
              name: 'NAME',
              position: 1,
              quantity: { value: 1 },
              price: undefined,
              productSKU: 'SKU',
            } as LineItem,
          ],
          payment: undefined,
        } as Basket,
      });

      const completion = new LoadProductIfNotLoaded({ sku: 'SKU', level: ProductCompletenessLevel.List });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadProductsForBasket$).toBeObservable(expected$);
    });
  });

  describe('loadBasketEligibleShippingMethods$', () => {
    beforeEach(() => {
      when(basketServiceMock.getBasketEligibleShippingMethods(anyString(), anything())).thenReturn(
        of([BasketMockData.getShippingMethod()])
      );

      store$.dispatch(
        new LoadBasketSuccess({
          basket: {
            id: 'BID',
            lineItems: [],
          } as Basket,
        })
      );
    });

    it('should call the basketService for loadBasketEligibleShippingMethods', done => {
      const action = new LoadBasketEligibleShippingMethods();
      actions$ = of(action);

      effects.loadBasketEligibleShippingMethods$.subscribe(() => {
        verify(basketServiceMock.getBasketEligibleShippingMethods('BID', undefined)).once();
        done();
      });
    });

    it('should map to action of type loadBasketEligibleShippingMethodsSuccess', () => {
      const action = new LoadBasketEligibleShippingMethods();
      const completion = new LoadBasketEligibleShippingMethodsSuccess({
        shippingMethods: [BasketMockData.getShippingMethod()],
      });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadBasketEligibleShippingMethods$).toBeObservable(expected$);
    });

    it('should map invalid request to action of type LoadBasketEligibleShippingMethodsFail', () => {
      when(basketServiceMock.getBasketEligibleShippingMethods(anyString(), anything())).thenReturn(
        throwError({ message: 'invalid' })
      );
      const action = new LoadBasketEligibleShippingMethods();
      const completion = new LoadBasketEligibleShippingMethodsFail({
        error: {
          message: 'invalid',
        } as HttpError,
      });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadBasketEligibleShippingMethods$).toBeObservable(expected$);
    });
  });

  describe('updateBasket$', () => {
    beforeEach(() => {
      when(basketServiceMock.updateBasket(anyString(), anything())).thenReturn(of(BasketMockData.getBasket()));

      store$.dispatch(
        new LoadBasketSuccess({
          basket: {
            id: 'BID',
            lineItems: [],
          } as Basket,
        })
      );
    });

    it('should call the basketService for updateBasket', done => {
      const basketId = 'BID';
      const update = { invoiceToAddress: '7654' };
      const action = new UpdateBasket({ update });
      actions$ = of(action);

      effects.updateBasket$.subscribe(() => {
        verify(basketServiceMock.updateBasket(basketId, update)).once();
        done();
      });
    });

    it('should map to action of type LoadBasketSuccess and ResetBasketErrors', () => {
      const update = { commonShippingMethod: 'shippingId' };
      const action = new UpdateBasket({ update });
      const completion1 = new LoadBasketSuccess({ basket: BasketMockData.getBasket() });
      const completion2 = new ResetBasketErrors();
      actions$ = hot('-a', { a: action });
      const expected$ = cold('-(cd)', { c: completion1, d: completion2 });

      expect(effects.updateBasket$).toBeObservable(expected$);
    });

    it('should map invalid request to action of type UpdateBasketFail', () => {
      const update = { commonShippingMethod: 'shippingId' };
      when(basketServiceMock.updateBasket(anyString(), anything())).thenReturn(throwError({ message: 'invalid' }));

      const action = new UpdateBasket({ update });
      const completion = new UpdateBasketFail({ error: { message: 'invalid' } as HttpError });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.updateBasket$).toBeObservable(expected$);
    });
  });

  describe('updateBasketShippingMethod$', () => {
    it('should trigger the updateBasket action if called', () => {
      const shippingId = 'shippingId';
      const action = new UpdateBasketShippingMethod({ shippingId });
      const completion = new UpdateBasket({
        update: { commonShippingMethod: shippingId },
      });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.updateBasketShippingMethod$).toBeObservable(expected$);
    });
  });

  describe('mergeBasketAfterLogin$', () => {
    it('should map to action of type addItemsToBasket if pre login basket is filled', () => {
      when(basketServiceMock.getBaskets()).thenReturn(of([{ id: 'BIDNEW' } as BasketBaseData]));

      store$.dispatch(
        new LoadBasketSuccess({
          basket: {
            id: 'BID',
            lineItems: [
              {
                id: 'BIID',
                name: 'NAME',
                quantity: { value: 1, unit: 'pcs.' },
                productSKU: 'SKU',
                price: undefined,
              } as LineItem,
            ],
          } as Basket,
        })
      );
      store$.dispatch(new LoadProductSuccess({ product: { sku: 'SKU' } as Product }));

      const action = new LoginUserSuccess({ customer: {} as Customer });
      const completion = new MergeBasket();
      actions$ = hot('-a', { a: action });
      const expected$ = cold('-c', { c: completion });

      expect(effects.mergeBasketAfterLogin$).toBeObservable(expected$);
    });
  });

  describe('mergeBasket$', () => {
    const basketID = 'BID';
    const sourceAuthToken = 'authToken';

    beforeEach(() => {
      when(basketServiceMock.mergeBasket(anyString(), anyString())).thenReturn(of(BasketMockData.getBasket()));

      store$.dispatch(
        new LoadBasketSuccess({
          basket: {
            id: 'BID',
            lineItems: [
              {
                id: 'BIID',
                name: 'NAME',
                quantity: { value: 1 },
                productSKU: 'SKU',
                price: undefined,
              } as LineItem,
            ],
          } as Basket,
        })
      );
      store$.dispatch(new LoadProductSuccess({ product: { sku: 'SKU' } as Product }));
      store$.dispatch(new SetAPIToken({ apiToken: sourceAuthToken }));
      store$.dispatch(new LoginUser({ credentials: {} as Credentials }));
    });

    it('should call the basketService for mergeBasket', done => {
      const action = new MergeBasket();
      actions$ = of(action);

      effects.mergeBasket$.subscribe(() => {
        verify(basketServiceMock.mergeBasket(basketID, sourceAuthToken)).once();
        done();
      });
    });

    it('should map to action of type MergeBasketSuccess', () => {
      const action = new MergeBasket();
      const completion = new MergeBasketSuccess({ basket: BasketMockData.getBasket() });
      actions$ = hot('-a', { a: action });
      const expected$ = cold('-c', { c: completion });

      expect(effects.mergeBasket$).toBeObservable(expected$);
    });

    it('should map invalid request to action of type MergeBasketFail', () => {
      when(basketServiceMock.mergeBasket(anyString(), anyString())).thenReturn(throwError({ message: 'invalid' }));

      const action = new MergeBasket();
      const completion = new MergeBasketFail({ error: { message: 'invalid' } as HttpError });
      actions$ = hot('-a', { a: action });
      const expected$ = cold('-c', { c: completion });

      expect(effects.mergeBasket$).toBeObservable(expected$);
    });
  });

  describe('loadBasketAfterLogin$', () => {
    it('should map to action of type LoadBasket if pre login basket is empty', () => {
      when(basketServiceMock.getBaskets()).thenReturn(of([{ id: 'BIDNEW' } as BasketBaseData]));

      const action = new LoginUserSuccess({ customer: {} as Customer });
      const completion = new LoadBasket();
      actions$ = hot('-a', { a: action });
      const expected$ = cold('-c', { c: completion });

      expect(effects.loadBasketAfterLogin$).toBeObservable(expected$);
    });
  });

  describe('loadBasketAfterLogin$', () => {
    it('should map to action of type LoadBasket if pre login basket is empty', () => {
      when(basketServiceMock.getBaskets()).thenReturn(of([{ id: 'BIDNEW' } as BasketBaseData]));

      const action = new LoginUserSuccess({ customer: {} as Customer });
      const completion = new LoadBasket();
      actions$ = hot('-a', { a: action });
      const expected$ = cold('-c', { c: completion });

      expect(effects.loadBasketAfterLogin$).toBeObservable(expected$);
    });
  });

  describe('routeListenerForResettingBasketErrors$', () => {
    it('should fire ResetBasketErrors when route basket or checkout/* is navigated', done => {
      router.navigateByUrl('/checkout/payment');

      effects.routeListenerForResettingBasketErrors$.subscribe(action => {
        expect(action).toMatchInlineSnapshot(`[Basket Internal] Reset Basket and Basket Promotion Errors`);
        done();
      });
    });

    it('should not fire ResetBasketErrors when route basket or checkout/* is navigated with query param error=true', done => {
      router.navigateByUrl('/checkout/payment?error=true');

      effects.routeListenerForResettingBasketErrors$.subscribe(fail, fail, fail);

      setTimeout(done, 1000);
    });

    it('should not fire ResetBasketErrors when route /something is navigated', done => {
      router.navigateByUrl('/something');

      effects.routeListenerForResettingBasketErrors$.subscribe(fail, fail, fail);

      setTimeout(done, 1000);
    });
  });
});
