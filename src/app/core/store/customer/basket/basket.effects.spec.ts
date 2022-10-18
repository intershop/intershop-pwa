import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action, Store } from '@ngrx/store';
import { cold, hot } from 'jasmine-marbles';
import { EMPTY, Observable, of, throwError } from 'rxjs';
import { anyString, anything, instance, mock, verify, when } from 'ts-mockito';

import { Basket } from 'ish-core/models/basket/basket.model';
import { LineItem } from 'ish-core/models/line-item/line-item.model';
import { BasketService } from 'ish-core/services/basket/basket.service';
import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { loadServerConfigSuccess } from 'ish-core/store/core/server-config';
import { CustomerStoreModule } from 'ish-core/store/customer/customer-store.module';
import { resetOrderErrors } from 'ish-core/store/customer/orders';
import { ApiTokenService } from 'ish-core/utils/api-token/api-token.service';
import { makeHttpError } from 'ish-core/utils/dev/api-service-utils';
import { BasketMockData } from 'ish-core/utils/dev/basket-mock-data';
import { routerTestNavigatedAction } from 'ish-core/utils/dev/routing';

import {
  createBasket,
  createBasketFail,
  createBasketSuccess,
  deleteBasketAttribute,
  deleteBasketAttributeFail,
  deleteBasketAttributeSuccess,
  loadBasket,
  loadBasketByAPIToken,
  loadBasketEligibleShippingMethods,
  loadBasketEligibleShippingMethodsFail,
  loadBasketEligibleShippingMethodsSuccess,
  loadBasketFail,
  loadBasketSuccess,
  loadBasketWithId,
  resetBasketErrors,
  setBasketAttribute,
  setBasketAttributeFail,
  setBasketAttributeSuccess,
  setBasketDesiredDeliveryDate,
  setBasketDesiredDeliveryDateFail,
  setBasketDesiredDeliveryDateSuccess,
  submitBasket,
  submitBasketFail,
  submitOrder,
  updateBasket,
  updateBasketCostCenter,
  updateBasketFail,
  updateBasketShippingMethod,
} from './basket.actions';
import { BasketEffects } from './basket.effects';

describe('Basket Effects', () => {
  let actions$: Observable<Action>;
  let basketServiceMock: BasketService;
  let effects: BasketEffects;
  let store: Store;
  let router: Router;

  beforeEach(() => {
    basketServiceMock = mock(BasketService);

    TestBed.configureTestingModule({
      imports: [
        CoreStoreModule.forTesting(['router', 'serverConfig', 'configuration']),
        CustomerStoreModule.forTesting('user', 'basket'),
        RouterTestingModule.withRoutes([{ path: '**', children: [] }]),
      ],
      providers: [
        {
          provide: ApiTokenService,
          useFactory: () => instance(mock(ApiTokenService)),
          useValue: { apiToken$: of({ apiToken: 'apiToken' }) },
        },
        { provide: BasketService, useFactory: () => instance(basketServiceMock) },
        BasketEffects,
        provideMockActions(() => actions$),
      ],
    });

    effects = TestBed.inject(BasketEffects);
    store = TestBed.inject(Store);
    router = TestBed.inject(Router);
  });

  describe('loadBasket$', () => {
    beforeEach(() => {
      when(basketServiceMock.getBasket()).thenCall(() => of({ id: 'BID' } as Basket));
    });

    it('should call the basketService for loadBasket', done => {
      const action = loadBasket();
      actions$ = of(action);

      effects.loadBasket$.subscribe(() => {
        verify(basketServiceMock.getBasket()).once();
        done();
      });
    });

    it('should map to action of type LoadBasketSuccess', () => {
      const id = 'BID';
      const action = loadBasket();
      const completion = loadBasketSuccess({ basket: { id } as Basket });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadBasket$).toBeObservable(expected$);
    });

    it('should map invalid request to action of type LoadBasketFail', () => {
      when(basketServiceMock.getBasket()).thenReturn(throwError(() => makeHttpError({ message: 'invalid' })));
      const action = loadBasket();
      const completion = loadBasketFail({ error: makeHttpError({ message: 'invalid' }) });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadBasket$).toBeObservable(expected$);
    });

    describe('with basket-id in session storage', () => {
      beforeEach(() => {
        window.sessionStorage.clear();
      });

      it('should map to action of type LoadBasketWithId', () => {
        window.sessionStorage.setItem('basket-id', 'BID');
        const action = loadBasket();
        const completion = loadBasketWithId({ basketId: 'BID' });
        actions$ = hot('-a-a-a', { a: action });
        const expected$ = cold('-c-c-c', { c: completion });

        expect(effects.loadBasket$).toBeObservable(expected$);
      });
    });
  });

  describe('loadBasketWithId$', () => {
    const basketId = 'BID';
    beforeEach(() => {
      when(basketServiceMock.getBasketWithId(basketId)).thenReturn(of({ id: basketId } as Basket));
    });

    it('should call the basketService for loadBasketWithId', done => {
      const action = loadBasketWithId({ basketId });
      actions$ = of(action);

      effects.loadBasketWithId$.subscribe(() => {
        verify(basketServiceMock.getBasketWithId(basketId)).once();
        done();
      });
    });

    it('should map to action of type LoadBasketSuccess', () => {
      const action = loadBasketWithId({ basketId });
      const completion = loadBasketSuccess({ basket: { id: basketId } as Basket });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadBasketWithId$).toBeObservable(expected$);
    });

    it('should map invalid request to action of type LoadBasketFail', () => {
      when(basketServiceMock.getBasketWithId(basketId)).thenReturn(
        throwError(() => makeHttpError({ message: 'invalid' }))
      );
      const action = loadBasketWithId({ basketId });
      const completion = loadBasketFail({ error: makeHttpError({ message: 'invalid' }) });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadBasketWithId$).toBeObservable(expected$);
    });
  });

  describe('loadBasketByAPIToken$', () => {
    it('should call the basket service on LoadUserByAPIToken action and load user on success', done => {
      when(basketServiceMock.getBasketByToken('dummy')).thenReturn(of({ id: 'basket' } as Basket));

      actions$ = of(loadBasketByAPIToken({ apiToken: 'dummy' }));

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

      actions$ = hot('a-a-a-', { a: loadBasketByAPIToken({ apiToken: 'dummy' }) });

      expect(effects.loadBasketByAPIToken$).toBeObservable(cold('------'));
    });
  });

  describe('recalculateBasketAfterCurrencyChange$', () => {
    beforeEach(() => {
      store.dispatch(
        loadServerConfigSuccess({
          config: {
            general: {
              defaultLocale: 'de_DE',
              defaultCurrency: 'EUR',
              locales: ['en_US', 'de_DE', 'fr_BE', 'nl_BE'],
              currencies: ['USD', 'EUR'],
            },
          },
        })
      );
    });

    it('should trigger a basket recalculation if the basket currency differs from current currency', done => {
      const id = 'BID';

      actions$ = of(loadBasketSuccess({ basket: { id, purchaseCurrency: 'USD' } as Basket }));

      effects.recalculateBasketAfterCurrencyChange$.subscribe(action => {
        expect(action).toMatchInlineSnapshot(`
                  [Basket Internal] Update Basket:
                    update: {"calculated":true}
                `);
        done();
      });
    });
  });

  describe('createBasket$', () => {
    beforeEach(() => {
      when(basketServiceMock.createBasket()).thenCall(() => of({ id: 'BID' } as Basket));
    });

    it('should call the basketService for createBasket', done => {
      const action = createBasket();
      actions$ = of(action);

      effects.createBasket$.subscribe(() => {
        verify(basketServiceMock.createBasket()).once();
        done();
      });
    });

    it('should map to action of type CreateBasketSuccess', () => {
      const id = 'BID';
      const action = createBasket();
      const completion = createBasketSuccess({ basket: { id } as Basket });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.createBasket$).toBeObservable(expected$);
    });

    it('should map invalid request to action of type CreateBasketFail', () => {
      when(basketServiceMock.createBasket()).thenReturn(throwError(() => makeHttpError({ message: 'invalid' })));
      const action = createBasket();
      const completion = createBasketFail({ error: makeHttpError({ message: 'invalid' }) });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.createBasket$).toBeObservable(expected$);
    });
  });

  describe('loadBasketEligibleShippingMethods$', () => {
    beforeEach(() => {
      when(basketServiceMock.getBasketEligibleShippingMethods(anything())).thenReturn(
        of([BasketMockData.getShippingMethod()])
      );

      store.dispatch(
        loadBasketSuccess({
          basket: {
            id: 'BID',
            lineItems: [],
          } as Basket,
        })
      );
    });

    it('should call the basketService for loadBasketEligibleShippingMethods', done => {
      const action = loadBasketEligibleShippingMethods();
      actions$ = of(action);

      effects.loadBasketEligibleShippingMethods$.subscribe(() => {
        verify(basketServiceMock.getBasketEligibleShippingMethods(undefined)).once();
        done();
      });
    });

    it('should map to action of type loadBasketEligibleShippingMethodsSuccess', () => {
      const action = loadBasketEligibleShippingMethods();
      const completion = loadBasketEligibleShippingMethodsSuccess({
        shippingMethods: [BasketMockData.getShippingMethod()],
      });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadBasketEligibleShippingMethods$).toBeObservable(expected$);
    });

    it('should map invalid request to action of type LoadBasketEligibleShippingMethodsFail', () => {
      when(basketServiceMock.getBasketEligibleShippingMethods(anything())).thenReturn(
        throwError(() => makeHttpError({ message: 'invalid' }))
      );
      const action = loadBasketEligibleShippingMethods();
      const completion = loadBasketEligibleShippingMethodsFail({
        error: makeHttpError({ message: 'invalid' }),
      });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadBasketEligibleShippingMethods$).toBeObservable(expected$);
    });
  });

  describe('updateBasket$', () => {
    beforeEach(() => {
      when(basketServiceMock.updateBasket(anything())).thenReturn(of(BasketMockData.getBasket()));

      store.dispatch(
        loadBasketSuccess({
          basket: {
            id: 'BID',
            lineItems: [],
          } as Basket,
        })
      );
    });

    it('should call the basketService for updateBasket', done => {
      const update = { invoiceToAddress: '7654' };
      const action = updateBasket({ update });
      actions$ = of(action);

      effects.updateBasket$.subscribe(() => {
        verify(basketServiceMock.updateBasket(update)).once();
        done();
      });
    });

    it('should map to action of type LoadBasketSuccess and ResetBasketErrors', () => {
      const update = { commonShippingMethod: 'shippingId' };
      const action = updateBasket({ update });
      const completion1 = loadBasketSuccess({ basket: BasketMockData.getBasket() });
      const completion2 = resetBasketErrors();
      actions$ = hot('-a', { a: action });
      const expected$ = cold('-(cd)', { c: completion1, d: completion2 });

      expect(effects.updateBasket$).toBeObservable(expected$);
    });

    it('should map invalid request to action of type UpdateBasketFail', () => {
      const update = { commonShippingMethod: 'shippingId' };
      when(basketServiceMock.updateBasket(anything())).thenReturn(
        throwError(() => makeHttpError({ message: 'invalid' }))
      );

      const action = updateBasket({ update });
      const completion = updateBasketFail({ error: makeHttpError({ message: 'invalid' }) });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.updateBasket$).toBeObservable(expected$);
    });
  });

  describe('updateBasketShippingMethod$', () => {
    it('should trigger the updateBasket action if called', () => {
      const shippingId = 'shippingId';
      const action = updateBasketShippingMethod({ shippingId });
      const completion = updateBasket({
        update: { commonShippingMethod: shippingId },
      });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.updateBasketShippingMethod$).toBeObservable(expected$);
    });
  });

  describe('updateBasketCostCenter$', () => {
    it('should trigger the updateBasket action if called', () => {
      const costCenter = 'costCenter123';
      const action = updateBasketCostCenter({ costCenter });
      const completion = updateBasket({
        update: { costCenter },
      });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.updateBasketCostCenter$).toBeObservable(expected$);
    });
  });

  describe('setBasketDesiredDeliveryDate$', () => {
    beforeEach(() => {
      when(basketServiceMock.updateBasketItemsDesiredDeliveryDate(anything(), anything())).thenReturn(of([]));
      store.dispatch(
        loadBasketSuccess({
          basket: {
            id: 'BID',
            attributes: [{ name: 'desiredDeliveryDate', value: desiredDeliveryDate }],
            lineItems,
          } as Basket,
        })
      );
    });
    const desiredDeliveryDate = '2022-02-20';
    const lineItems: LineItem[] = [{ id: '1', desiredDeliveryDate: undefined } as LineItem];

    it('should call the basketService for setBasketDesiredDeliveryDate', done => {
      const action = setBasketDesiredDeliveryDate({ desiredDeliveryDate });
      actions$ = of(action);

      effects.setBasketDesiredDeliveryDate$.subscribe(() => {
        verify(basketServiceMock.updateBasketItemsDesiredDeliveryDate(desiredDeliveryDate, anything())).once();
        done();
      });
    });

    it('should map to actions of type setBasketAttribute and setBasketDesiredDeliveryDate', () => {
      const action = setBasketDesiredDeliveryDate({ desiredDeliveryDate });
      const completion1 = setBasketAttribute({
        attribute: { name: 'desiredDeliveryDate', value: desiredDeliveryDate },
      });
      const completion2 = setBasketDesiredDeliveryDateSuccess();
      actions$ = hot('-a', { a: action });
      const expected$ = cold('-(cd)', { c: completion1, d: completion2 });

      expect(effects.setBasketDesiredDeliveryDate$).toBeObservable(expected$);
    });

    it('should map invalid request to action of type setBasketDesiredDeliveryDateFail', () => {
      when(basketServiceMock.updateBasketItemsDesiredDeliveryDate(anything(), anything())).thenReturn(
        throwError(() => makeHttpError({ message: 'invalid' }))
      );

      const action = setBasketDesiredDeliveryDate({ desiredDeliveryDate });
      const completion = setBasketDesiredDeliveryDateFail({ error: makeHttpError({ message: 'invalid' }) });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.setBasketDesiredDeliveryDate$).toBeObservable(expected$);
    });
  });

  describe('setCustomAttributeToBasket$', () => {
    beforeEach(() => {
      when(basketServiceMock.createBasketAttribute(anything())).thenReturn(of(undefined));
      when(basketServiceMock.updateBasketAttribute(anything())).thenReturn(of(undefined));

      store.dispatch(
        loadBasketSuccess({
          basket: {
            id: 'BID',
            lineItems: [],
            attributes: [
              {
                name: 'attr2',
                value: 'abc',
              },
            ],
          } as Basket,
        })
      );
    });

    it('should call the basketService for setCustomAttributeToBasket (create)', done => {
      const attribute = { name: 'attr1', value: 'xyz' };
      const action = setBasketAttribute({ attribute });
      actions$ = of(action);

      effects.setCustomAttributeToBasket$.subscribe(() => {
        verify(basketServiceMock.createBasketAttribute(attribute)).once();
        done();
      });
    });

    it('should call the basketService for setCustomAttributeToBasket (update)', done => {
      const attribute = { name: 'attr2', value: 'xyz' };
      const action = setBasketAttribute({ attribute });
      actions$ = of(action);

      effects.setCustomAttributeToBasket$.subscribe(() => {
        verify(basketServiceMock.updateBasketAttribute(attribute)).once();
        done();
      });
    });

    it('should map to action of type SetBasketCustomAttributeSuccess and LoadBasket', () => {
      const attribute = { name: 'attr', value: 'xyz' };
      const action = setBasketAttribute({ attribute });
      const completion1 = setBasketAttributeSuccess();
      const completion2 = loadBasket();
      actions$ = hot('-a', { a: action });
      const expected$ = cold('-(cd)', { c: completion1, d: completion2 });

      expect(effects.setCustomAttributeToBasket$).toBeObservable(expected$);
    });

    it('should map invalid request to action of type SetBasketCustomAttributeFail', () => {
      when(basketServiceMock.createBasketAttribute(anything())).thenReturn(
        throwError(() => makeHttpError({ message: 'invalid' }))
      );

      const attribute = { name: 'attr', value: 'xyz' };
      const action = setBasketAttribute({ attribute });
      const completion = setBasketAttributeFail({ error: makeHttpError({ message: 'invalid' }) });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.setCustomAttributeToBasket$).toBeObservable(expected$);
    });
  });

  describe('deleteCustomAttributeFromBasket$', () => {
    beforeEach(() => {
      when(basketServiceMock.deleteBasketAttribute(anyString())).thenReturn(of(undefined));

      store.dispatch(
        loadBasketSuccess({
          basket: {
            id: 'BID',
            lineItems: [],
            attributes: [
              {
                name: 'attr2',
                value: 'abc',
              },
            ],
          } as Basket,
        })
      );
    });

    it('should call the basketService for deleteCustomAttributeToBasket', done => {
      const attributeName = 'attr2';
      const action = deleteBasketAttribute({ attributeName });
      actions$ = of(action);

      effects.deleteCustomAttributeFromBasket$.subscribe(() => {
        verify(basketServiceMock.deleteBasketAttribute(attributeName)).once();
        done();
      });
    });

    it('should not call the basketService for deleteCustomAttributeToBasket if the custom attribute does not exist at basket', done => {
      const attributeName = 'attr1';
      const action = deleteBasketAttribute({ attributeName });
      actions$ = of(action);

      effects.deleteCustomAttributeFromBasket$.subscribe({
        next: () => {
          verify(basketServiceMock.deleteBasketAttribute(attributeName)).never();
        },
        error: fail,
        complete: done,
      });
    });

    it('should map to action of type DeleteBasketCustomAttributeSuccess and LoadBasket', () => {
      const attributeName = 'attr2';
      const action = deleteBasketAttribute({ attributeName });
      actions$ = of(action);

      const completion1 = deleteBasketAttributeSuccess();
      const completion2 = loadBasket();
      actions$ = hot('-a', { a: action });
      const expected$ = cold('-(cd)', { c: completion1, d: completion2 });

      expect(effects.deleteCustomAttributeFromBasket$).toBeObservable(expected$);
    });

    it('should map invalid request to action of type DeleteBasketCustomAttributeFail', () => {
      when(basketServiceMock.deleteBasketAttribute(anyString())).thenReturn(
        throwError(() => makeHttpError({ message: 'invalid' }))
      );

      const attributeName = 'attr2';
      const action = deleteBasketAttribute({ attributeName });
      actions$ = of(action);
      const completion = deleteBasketAttributeFail({ error: makeHttpError({ message: 'invalid' }) });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.deleteCustomAttributeFromBasket$).toBeObservable(expected$);
    });
  });

  describe('routeListenerForResettingBasketErrors', () => {
    it('should fire ResetBasketErrors when route basket or checkout/* is navigated', () => {
      router.navigateByUrl('/checkout/payment');

      const action = routerTestNavigatedAction({
        routerState: { url: '/checkout/payment' },
      });
      actions$ = of(action);

      const completion1 = resetBasketErrors();
      const completion2 = resetOrderErrors();
      actions$ = hot('-a', { a: action });
      const expected$ = cold('-(cd)', { c: completion1, d: completion2 });

      expect(effects.routeListenerForResettingBasketErrors$).toBeObservable(expected$);
    });

    it('should not fire ResetBasketErrors when route basket or checkout/* is navigated with query param error=true', () => {
      actions$ = of(
        routerTestNavigatedAction({
          routerState: { url: '/checkout/payment', queryParams: { error: true } },
        })
      );

      expect(effects.routeListenerForResettingBasketErrors$).toBeObservable(cold('|'));
    });

    it('should not fire ResetBasketErrors when route /something is navigated', () => {
      router.navigateByUrl('/something');

      actions$ = of(
        routerTestNavigatedAction({
          routerState: { url: '/something' },
        })
      );
      expect(effects.routeListenerForResettingBasketErrors$).toBeObservable(cold('|'));
    });
  });

  describe('loadBasketOnBasketPage$', () => {
    it('should fire LoadBasket when route basket is navigated', () => {
      router.navigateByUrl('/basket');

      const action = routerTestNavigatedAction({
        routerState: { url: '/basket' },
      });
      actions$ = of(action);

      const completion = loadBasket();
      actions$ = hot('-a', { a: action });
      const expected$ = cold('-c', { c: completion });

      expect(effects.loadBasketOnBasketPage$).toBeObservable(expected$);
    });

    it('should not fire LoadBasket when route /something is navigated', () => {
      router.navigateByUrl('/something');

      actions$ = of(
        routerTestNavigatedAction({
          routerState: { url: '/something' },
        })
      );
      expect(effects.loadBasketOnBasketPage$).toBeObservable(cold('|'));
    });
  });

  describe('createRequisition$', () => {
    beforeEach(() => {
      store.dispatch(loadBasketSuccess({ basket: { id: 'BID' } as Basket }));
    });

    it('should call the basketService for submitBasket', done => {
      when(basketServiceMock.createRequisition(anyString())).thenReturn(of(undefined));
      const payload = 'BID';
      const action = submitBasket();
      actions$ = of(action);

      effects.createRequisition$.subscribe(() => {
        verify(basketServiceMock.createRequisition(payload)).once();
        done();
      });
    });

    it('should map a valid request to action of type SubmitBasketSuccess', done => {
      when(basketServiceMock.createRequisition(anyString())).thenReturn(of(undefined));

      actions$ = of(submitBasket());

      effects.createRequisition$.subscribe(action => {
        expect(action).toMatchInlineSnapshot(`[Basket API] Submit a Basket for Approval Success`);
        done();
      });
    });

    it('should map an invalid request to action of type SubmitBasketFail', () => {
      when(basketServiceMock.createRequisition(anyString())).thenReturn(
        throwError(() => makeHttpError({ message: 'invalid' }))
      );
      const action = submitBasket();
      const completion = submitBasketFail({ error: makeHttpError({ message: 'invalid' }) });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.createRequisition$).toBeObservable(expected$);
    });
  });

  describe('submitOrder$', () => {
    beforeEach(() => {
      when(basketServiceMock.updateBasketItemsDesiredDeliveryDate(anything(), anything())).thenReturn(of([]));
      store.dispatch(
        loadBasketSuccess({
          basket: {
            id: 'BID',
            attributes: [{ name: 'desiredDeliveryDate', value: desiredDeliveryDate }],
            lineItems,
          } as Basket,
        })
      );
    });
    const desiredDeliveryDate = '2022-02-20';
    const lineItems: LineItem[] = [{ id: '1', desiredDeliveryDate: undefined } as LineItem];

    it('should call the basketService for submitOrder if the basket has a desired delivery date', done => {
      const action = submitOrder();
      actions$ = of(action);

      effects.submitOrder$.subscribe(() => {
        verify(basketServiceMock.updateBasketItemsDesiredDeliveryDate(desiredDeliveryDate, anything())).once();
        done();
      });
    });

    it('should not call the basketService for submitOrder if the basket has no desired delivery date', done => {
      store.dispatch(
        loadBasketSuccess({
          basket: { id: 'BID', attributes: [] } as Basket,
        })
      );

      const action = submitOrder();
      actions$ = of(action);

      effects.submitOrder$.subscribe({
        next: () => {
          verify(basketServiceMock.updateBasketItemsDesiredDeliveryDate(anything(), anything())).never();
        },
        error: fail,
        complete: done,
      });
    });

    it('should map a valid request to action of type continueCheckout', done => {
      actions$ = of(submitOrder());

      effects.submitOrder$.subscribe(action => {
        expect(action).toMatchInlineSnapshot(`
          [Basket] Validate Basket and continue checkout:
            targetStep: 5
        `);
        done();
      });
    });

    it('should map an invalid request to action of type setBasketDesiredDeliveryDateFail', () => {
      when(basketServiceMock.updateBasketItemsDesiredDeliveryDate(anything(), anything())).thenReturn(
        throwError(() => makeHttpError({ message: 'invalid' }))
      );
      const action = submitOrder();
      const completion = setBasketDesiredDeliveryDateFail({ error: makeHttpError({ message: 'invalid' }) });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.submitOrder$).toBeObservable(expected$);
    });
  });
});
