import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action, Store, StoreModule, combineReducers } from '@ngrx/store';
import { cold, hot } from 'jest-marbles';
import { Observable, of, throwError } from 'rxjs';
import { anyNumber, anyString, anything, capture, deepEqual, instance, mock, verify, when } from 'ts-mockito';

import { OrderService } from '../../../account/services/order/order.service';
import { LoginUserSuccess, LogoutUser } from '../../../core/store/user/user.actions';
import { BasketItem } from '../../../models/basket-item/basket-item.model';
import { Basket } from '../../../models/basket/basket.model';
import { Customer } from '../../../models/customer/customer.model';
import { HttpError } from '../../../models/http-error/http-error.model';
import { Link } from '../../../models/link/link.model';
import { Order } from '../../../models/order/order.model';
import { PaymentMethod } from '../../../models/payment-method/payment-method.model';
import { Product } from '../../../models/product/product.model';
import { LoadProduct, LoadProductSuccess } from '../../../shopping/store/products';
import { shoppingReducers } from '../../../shopping/store/shopping.system';
import { BasketMockData } from '../../../utils/dev/basket-mock-data';
import { BasketService } from '../../services/basket/basket.service';
import { checkoutReducers } from '../checkout.system';

import * as basketActions from './basket.actions';
import { BasketEffects } from './basket.effects';

describe('Basket Effects', () => {
  let actions$: Observable<Action>;
  let basketServiceMock: BasketService;
  let orderServiceMock: OrderService;
  let effects: BasketEffects;
  let routerMock: Router;
  let store$: Store<{}>;

  beforeEach(() => {
    routerMock = mock(Router);
    basketServiceMock = mock(BasketService);
    orderServiceMock = mock(OrderService);

    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          shopping: combineReducers(shoppingReducers),
          checkout: combineReducers(checkoutReducers),
        }),
      ],
      providers: [
        BasketEffects,
        provideMockActions(() => actions$),
        { provide: BasketService, useFactory: () => instance(basketServiceMock) },
        { provide: OrderService, useFactory: () => instance(orderServiceMock) },
        { provide: Router, useFactory: () => instance(routerMock) },
      ],
    });

    effects = TestBed.get(BasketEffects);
    store$ = TestBed.get(Store);
  });

  describe('loadBasket$', () => {
    beforeEach(() => {
      when(basketServiceMock.getBasket(anyString())).thenCall((id: string) => of({ id: id } as Basket));
    });

    it('should call the basketService for loadBasket', done => {
      const payload = 'BID';
      const action = new basketActions.LoadBasket(payload);
      actions$ = of(action);

      effects.loadBasket$.subscribe(() => {
        verify(basketServiceMock.getBasket(payload)).once();
        done();
      });
    });

    it('should map to action of type LoadBasketSuccess', () => {
      const payload = 'BID';
      const action = new basketActions.LoadBasket(payload);
      const completion = new basketActions.LoadBasketSuccess({ id: payload } as Basket);
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadBasket$).toBeObservable(expected$);
    });

    it('should map invalid request to action of type LoadBasketFail', () => {
      when(basketServiceMock.getBasket(anyString())).thenReturn(throwError({ message: 'invalid' }));
      const action = new basketActions.LoadBasket('BID');
      const completion = new basketActions.LoadBasketFail({ message: 'invalid' } as HttpError);
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadBasket$).toBeObservable(expected$);
    });
  });

  describe('updateBasket$', () => {
    it('should call the basketService for updateBasket', done => {
      when(basketServiceMock.updateBasket(anyString(), anything())).thenReturn(of(undefined));

      store$.dispatch(
        new basketActions.LoadBasketSuccess({
          id: 'BID',
          lineItems: [],
        } as Basket)
      );

      const basketId = 'BID';
      const payload = { invoiceToAddress: { id: '7654' } };
      const action = new basketActions.UpdateBasket(payload);
      actions$ = of(action);

      effects.updateBasket$.subscribe(() => {
        verify(basketServiceMock.updateBasket(basketId, payload)).once();
        done();
      });
    });
  });

  describe('updateBasketShippingMethod$', () => {
    beforeEach(() => {
      when(basketServiceMock.updateBasketItem(anyString(), anyString(), anything())).thenReturn(of(undefined));

      const basketId = 'BID';
      store$.dispatch(
        new basketActions.LoadBasketSuccess({
          id: basketId,
          lineItems: [],
        } as Basket)
      );

      store$.dispatch(
        new basketActions.LoadBasketItemsSuccess([
          {
            id: 'BIID1',
          } as BasketItem,
          {
            id: 'BIID2',
          } as BasketItem,
        ])
      );
    });

    it('should call the basketService for updateBasketItem', done => {
      const basketId = 'BID';
      const payload = 'shippingId';
      const action = new basketActions.UpdateBasketShippingMethod(payload);
      actions$ = of(action);

      effects.updateBasketShippingMethod$.subscribe(() => {
        verify(basketServiceMock.updateBasketItem(basketId, anything(), anything())).twice();
        verify(
          basketServiceMock.updateBasketItem(basketId, 'BIID1', deepEqual({ shippingMethod: { id: 'shippingId' } }))
        ).once();

        done();
      });
    });

    it('should map to action of type UpdateBasketSuccess', () => {
      const payload = 'shippingId';
      const action = new basketActions.UpdateBasketShippingMethod(payload);
      const completion = new basketActions.UpdateBasketSuccess();
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.updateBasketShippingMethod$).toBeObservable(expected$);
    });

    it('should map invalid request to action of type UpdateBasketFail', () => {
      const payload = 'shippingId';
      when(basketServiceMock.updateBasketItem(anyString(), anyString(), anything())).thenReturn(
        throwError({ message: 'invalid' })
      );

      const action = new basketActions.UpdateBasketShippingMethod(payload);
      const completion = new basketActions.UpdateBasketFail({ message: 'invalid' } as HttpError);
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.updateBasketShippingMethod$).toBeObservable(expected$);
    });
  });

  describe('loadBasketItems$', () => {
    beforeEach(() => {
      when(basketServiceMock.getBasketItems(anyString())).thenReturn(of([]));

      store$.dispatch(
        new basketActions.LoadBasketSuccess({
          id: 'BID',
          lineItems: [],
        } as Basket)
      );
    });

    it('should call the basketService for loadBasketItems', done => {
      const payload = 'BID';
      const action = new basketActions.LoadBasketItems(payload);
      actions$ = of(action);

      effects.loadBasketItems$.subscribe(() => {
        verify(basketServiceMock.getBasketItems(payload)).once();
        done();
      });
    });

    it('should map to action of type LoadBasketItemsSuccess', () => {
      const payload = 'BID';
      const action = new basketActions.LoadBasketItems(payload);
      const completion = new basketActions.LoadBasketItemsSuccess([] as BasketItem[]);
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadBasketItems$).toBeObservable(expected$);
    });

    it('should map invalid request to action of type LoadBasketItemsFail', () => {
      when(basketServiceMock.getBasketItems(anyString())).thenReturn(throwError({ message: 'invalid' }));

      const action = new basketActions.LoadBasketItems('BID');
      const completion = new basketActions.LoadBasketItemsFail({ message: 'invalid' } as HttpError);
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadBasketItems$).toBeObservable(expected$);
    });

    it('should trigger LoadBasketItems action if LoadBasketSuccess action triggered', () => {
      const action = new basketActions.LoadBasketSuccess({
        id: 'BID',
      } as Basket);
      const completion = new basketActions.LoadBasketItems('BID');
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadBasketItemsAfterBasketLoad$).toBeObservable(expected$);
    });
  });

  describe('loadProductsForBasket$', () => {
    beforeEach(() => {
      when(basketServiceMock.addItemsToBasket(anything(), anyString())).thenReturn(of());

      store$.dispatch(
        new basketActions.LoadBasketSuccess({
          id: 'BID',
          lineItems: [],
        } as Basket)
      );
    });

    it('should trigger LoadProduct actions for line items if LoadBasketSuccess action triggered', () => {
      const action = new basketActions.LoadBasketItemsSuccess([
        {
          id: 'BIID',
          name: 'NAME',
          quantity: { value: 1 },
          productSKU: 'SKU',
          price: undefined,
        } as BasketItem,
      ]);
      const completion = new LoadProduct('SKU');
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadProductsForBasket$).toBeObservable(expected$);
    });
  });

  describe('addItemsToBasket$', () => {
    beforeEach(() => {
      when(basketServiceMock.addItemsToBasket(anything(), anyString())).thenReturn(of(undefined));
    });

    it('should call the basketService for addItemsToBasket', done => {
      store$.dispatch(
        new basketActions.LoadBasketSuccess({
          id: 'BID',
          lineItems: [],
        } as Basket)
      );

      const payload = { items: [{ sku: 'SKU', quantity: 1 }] };
      const action = new basketActions.AddItemsToBasket(payload);
      actions$ = of(action);

      effects.addItemsToBasket$.subscribe(() => {
        verify(basketServiceMock.addItemsToBasket(payload.items, 'BID')).once();
        done();
      });
    });

    it('should call the basketService for addItemsToBasket with specific basketId when basketId set', done => {
      store$.dispatch(
        new basketActions.LoadBasketSuccess({
          id: 'BID',
          lineItems: [],
        } as Basket)
      );

      const payload = { items: [{ sku: 'SKU', quantity: 1 }], basketId: 'BID' };
      const action = new basketActions.AddItemsToBasket(payload);
      actions$ = of(action);

      effects.addItemsToBasket$.subscribe(() => {
        verify(basketServiceMock.addItemsToBasket(payload.items, 'BID')).once();
        done();
      });
    });

    it('should not call the basketService for addItemsToBasket if no basket in store', () => {
      const payload = { items: [{ sku: 'SKU', quantity: 1 }] };
      const action = new basketActions.AddItemsToBasket(payload);
      actions$ = of(action);

      effects.addItemsToBasket$.subscribe(fail, fail);

      verify(basketServiceMock.addItemsToBasket(anything(), 'BID')).never();
    });

    it('should call the basketService for getBasket when no basket is present', done => {
      when(basketServiceMock.getBasket()).thenReturn(of({} as Basket));

      const payload = { items: [{ sku: 'SKU', quantity: 1 }] };
      const action = new basketActions.AddItemsToBasket(payload);
      actions$ = of(action);

      effects.getBasketBeforeAddItemsToBasket$.subscribe(() => {
        verify(basketServiceMock.getBasket()).once();
        done();
      });
    });

    it('should map to action of type AddItemsToBasketSuccess', () => {
      store$.dispatch(
        new basketActions.LoadBasketSuccess({
          id: 'BID',
          lineItems: [],
        } as Basket)
      );

      const payload = { items: [{ sku: 'SKU', quantity: 1 }] };
      const action = new basketActions.AddItemsToBasket(payload);
      const completion = new basketActions.AddItemsToBasketSuccess();
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.addItemsToBasket$).toBeObservable(expected$);
    });

    it('should map invalid request to action of type AddItemsToBasketFail', () => {
      when(basketServiceMock.addItemsToBasket(anything(), anyString())).thenReturn(throwError({ message: 'invalid' }));

      store$.dispatch(
        new basketActions.LoadBasketSuccess({
          id: 'BID',
          lineItems: [],
        } as Basket)
      );

      const payload = { items: [{ sku: 'invalid', quantity: 1 }] };
      const action = new basketActions.AddItemsToBasket(payload);
      const completion = new basketActions.AddItemsToBasketFail({ message: 'invalid' } as HttpError);
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.addItemsToBasket$).toBeObservable(expected$);
    });
  });

  describe('addProductToBasket$', () => {
    it('should map an AddProductToBasket to an AddItemsToBasket action', () => {
      const payload = { sku: 'SKU', quantity: 1 };
      const action = new basketActions.AddProductToBasket(payload);
      const completion = new basketActions.AddItemsToBasket({ items: [payload] });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.addProductToBasket$).toBeObservable(expected$);
    });
  });

  describe('addQuoteToBasket$', () => {
    it('should call the basketService for addQuoteToBasket', done => {
      when(basketServiceMock.addQuoteToBasket(anyString(), anyString())).thenReturn(of({} as Link));
      store$.dispatch(
        new basketActions.LoadBasketSuccess({
          id: 'BID',
          lineItems: [],
        } as Basket)
      );

      const payload = 'QID';
      const action = new basketActions.AddQuoteToBasket(payload);
      actions$ = of(action);

      effects.addQuoteToBasket$.subscribe(() => {
        verify(basketServiceMock.addQuoteToBasket(payload, 'BID')).once();
        done();
      });
    });

    it('should map to action of type AddQuoteToBasketSuccess', () => {
      when(basketServiceMock.addQuoteToBasket(anyString(), anyString())).thenReturn(of({} as Link));

      store$.dispatch(
        new basketActions.LoadBasketSuccess({
          id: 'BID',
          lineItems: [],
        } as Basket)
      );

      const payload = 'QID';
      const action = new basketActions.AddQuoteToBasket(payload);
      const completion = new basketActions.AddQuoteToBasketSuccess({} as Link);
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.addQuoteToBasket$).toBeObservable(expected$);
    });

    it('should map invalid request to action of type AddQuoteToBasketFail', () => {
      when(basketServiceMock.addQuoteToBasket(anyString(), anyString())).thenReturn(throwError({ message: 'invalid' }));

      store$.dispatch(
        new basketActions.LoadBasketSuccess({
          id: 'BID',
          lineItems: [],
        } as Basket)
      );

      const payload = 'QID';
      const action = new basketActions.AddQuoteToBasket(payload);
      const completion = new basketActions.AddQuoteToBasketFail({ message: 'invalid' } as HttpError);
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.addQuoteToBasket$).toBeObservable(expected$);
    });
  });

  describe('loadBasketAfterAddItemsToBasket$', () => {
    it('should map to action of type LoadBasket if AddItemsToBasketSuccess action triggered', () => {
      const action = new basketActions.AddItemsToBasketSuccess();
      const completion = new basketActions.LoadBasket();
      actions$ = hot('-a', { a: action });
      const expected$ = cold('-c', { c: completion });

      expect(effects.loadBasketAfterBasketChangeSuccess$).toBeObservable(expected$);
    });
  });

  describe('mergeBasketAfterLogin$', () => {
    it('should map to action of type addItemsToBasket if pre login basket is filled', () => {
      when(basketServiceMock.getBasket()).thenReturn(of({ id: 'BIDNEW' } as Basket));

      store$.dispatch(
        new basketActions.LoadBasketSuccess({
          id: 'BID',
          lineItems: [],
        } as Basket)
      );
      store$.dispatch(
        new basketActions.LoadBasketItemsSuccess([
          {
            id: 'BIID',
            name: 'NAME',
            quantity: { value: 1 },
            productSKU: 'SKU',
            price: undefined,
          } as BasketItem,
        ])
      );
      store$.dispatch(new LoadProductSuccess({ sku: 'SKU' } as Product));

      const action = new LoginUserSuccess({} as Customer);
      const completion = new basketActions.AddItemsToBasket({
        items: [
          {
            sku: 'SKU',
            quantity: 1,
          },
        ],
        basketId: 'BIDNEW',
      });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.mergeBasketAfterLogin$).toBeObservable(expected$);
    });
  });

  describe('loadBasketAfterLogin$', () => {
    it('should map to action of type LoadBasket if pre login basket is empty', () => {
      when(basketServiceMock.getBasket()).thenReturn(of({} as Basket));

      const action = new LoginUserSuccess({} as Customer);
      const completion = new basketActions.LoadBasket();
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadBasketAfterLogin$).toBeObservable(expected$);
    });
  });

  describe('updateBasketItems$', () => {
    beforeEach(() => {
      when(basketServiceMock.updateBasketItem(anyString(), anyString(), anyNumber())).thenReturn(of());

      store$.dispatch(
        new basketActions.LoadBasketSuccess({
          id: 'BID',
          lineItems: [],
        } as Basket)
      );
      store$.dispatch(
        new basketActions.LoadBasketItemsSuccess([
          {
            id: 'BIID',
            name: 'NAME',
            quantity: { value: 1 },
            productSKU: 'SKU',
            price: undefined,
          } as BasketItem,
        ])
      );
    });

    it('should call the basketService for updateBasketItem if quantity > 0', done => {
      const payload = [
        {
          itemId: 'BIID',
          quantity: 2,
        },
        {
          itemId: 'BIID',
          quantity: 3,
        },
        {
          itemId: 'BIID',
          quantity: 4,
        },
      ];
      const action = new basketActions.UpdateBasketItems(payload);
      actions$ = of(action);

      effects.updateBasketItems$.subscribe(() => {
        verify(basketServiceMock.updateBasketItem('BID', payload[1].itemId, anything())).thrice();
        verify(
          basketServiceMock.updateBasketItem('BID', payload[1].itemId, deepEqual({ quantity: { value: 2 } }))
        ).once();
        done();
      });
    });

    it('should call the basketService for deleteBasketItem if quantity = 0', done => {
      when(basketServiceMock.deleteBasketItem(anyString(), anyString())).thenReturn(of());

      const payload = [
        {
          itemId: 'BIID',
          quantity: 0,
        },
      ];
      const action = new basketActions.UpdateBasketItems(payload);
      actions$ = of(action);

      effects.updateBasketItems$.subscribe(() => {
        verify(basketServiceMock.deleteBasketItem(payload[0].itemId, 'BID')).once();
        done();
      });
    });

    it('should map to action of type UpdateBasketItemsSuccess', () => {
      const payload = [
        {
          itemId: 'IID',
          quantity: 2,
        },
      ];
      const action = new basketActions.UpdateBasketItems(payload);
      const completion = new basketActions.UpdateBasketItemsSuccess();
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.updateBasketItems$).toBeObservable(expected$);
    });

    it('should map invalid request to action of type UpdateBasketItemsFail', () => {
      when(basketServiceMock.updateBasketItem(anyString(), anyString(), anything())).thenReturn(
        throwError({ message: 'invalid' })
      );

      const payload = [
        {
          itemId: 'BIID',
          quantity: 2,
        },
      ];
      const action = new basketActions.UpdateBasketItems(payload);
      const completion = new basketActions.UpdateBasketItemsFail({ message: 'invalid' } as HttpError);
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.updateBasketItems$).toBeObservable(expected$);
    });
  });

  describe('loadBasketAfterUpdateBasketItem$', () => {
    it('should map to action of type LoadBasket if UpdateBasketItemSuccess action triggered', () => {
      const action = new basketActions.UpdateBasketItemsSuccess();
      const completion = new basketActions.LoadBasket();
      actions$ = hot('-a', { a: action });
      const expected$ = cold('-c', { c: completion });

      expect(effects.loadBasketAfterBasketChangeSuccess$).toBeObservable(expected$);
    });
  });

  describe('deleteBasketItem$', () => {
    beforeEach(() => {
      when(basketServiceMock.deleteBasketItem(anyString(), anyString())).thenReturn(of(undefined));

      store$.dispatch(
        new basketActions.LoadBasketSuccess({
          id: 'BID',
          lineItems: [],
        } as Basket)
      );
    });

    it('should call the basketService for DeleteBasketItem action', done => {
      const payload = 'BIID';
      const action = new basketActions.DeleteBasketItem(payload);
      actions$ = of(action);

      effects.deleteBasketItem$.subscribe(() => {
        verify(basketServiceMock.deleteBasketItem('BIID', 'BID')).once();
        done();
      });
    });

    it('should map to action of type DeleteBasketItemSuccess', () => {
      const payload = 'BIID';
      const action = new basketActions.DeleteBasketItem(payload);
      const completion = new basketActions.DeleteBasketItemSuccess();
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.deleteBasketItem$).toBeObservable(expected$);
    });

    it('should map invalid request to action of type DeleteBasketItemFail', () => {
      when(basketServiceMock.deleteBasketItem(anyString(), anyString())).thenReturn(throwError({ message: 'invalid' }));

      const payload = 'BIID';
      const action = new basketActions.DeleteBasketItem(payload);
      const completion = new basketActions.DeleteBasketItemFail({ message: 'invalid' } as HttpError);
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.deleteBasketItem$).toBeObservable(expected$);
    });
  });

  describe('loadBasketAfterDeleteBasketItem$', () => {
    it('should map to action of type LoadBasket if DeleteBasketItemSuccess action triggered', () => {
      const action = new basketActions.DeleteBasketItemSuccess();
      const completion = new basketActions.LoadBasket();
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadBasketAfterBasketChangeSuccess$).toBeObservable(expected$);
    });
  });

  describe('loadBasketEligibleShippingMethods$', () => {
    beforeEach(() => {
      when(basketServiceMock.getBasketItemOptions(anyString(), anyString())).thenReturn(
        of({ eligibleShippingMethods: { shippingMethods: [BasketMockData.getShippingMethod()] } })
      );

      store$.dispatch(
        new basketActions.LoadBasketSuccess({
          id: 'BID',
          lineItems: [],
        } as Basket)
      );

      store$.dispatch(new basketActions.LoadBasketItemsSuccess([BasketMockData.getBasketItem()]));
    });
    it('should call the basketService for loadBasketItemOptions', done => {
      const action = new basketActions.LoadBasketEligibleShippingMethods();
      actions$ = of(action);

      effects.loadBasketEligibleShippingMethods$.subscribe(() => {
        verify(basketServiceMock.getBasketItemOptions('BID', '4712')).once();
        done();
      });
    });

    it('should map to action of type loadBasketEligibleShippingMethodsSuccess', () => {
      const action = new basketActions.LoadBasketEligibleShippingMethods();
      const completion = new basketActions.LoadBasketEligibleShippingMethodsSuccess([
        BasketMockData.getShippingMethod(),
      ]);
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadBasketEligibleShippingMethods$).toBeObservable(expected$);
    });

    it('should map invalid request to action of type LoadBasketEligibleShippingMethodsFail', () => {
      when(basketServiceMock.getBasketItemOptions(anyString(), anyString())).thenReturn(
        throwError({ message: 'invalid' })
      );
      const action = new basketActions.LoadBasketEligibleShippingMethods();
      const completion = new basketActions.LoadBasketEligibleShippingMethodsFail({
        message: 'invalid',
      } as HttpError);
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadBasketEligibleShippingMethods$).toBeObservable(expected$);
    });
  });

  describe('loadBasketEligiblePaymentMethods$', () => {
    beforeEach(() => {
      when(basketServiceMock.getBasketPaymentOptions(anyString())).thenReturn(of([BasketMockData.getPaymentMethod()]));

      store$.dispatch(
        new basketActions.LoadBasketSuccess({
          id: 'BID',
          lineItems: [],
        } as Basket)
      );
    });
    it('should call the basketService for loadBasketPaymentOptions', done => {
      const action = new basketActions.LoadBasketEligiblePaymentMethods();
      actions$ = of(action);

      effects.loadBasketEligiblePaymentMethods$.subscribe(() => {
        verify(basketServiceMock.getBasketPaymentOptions('BID')).once();
        done();
      });
    });

    it('should map to action of type loadBasketEligiblePaymentMethodsSuccess', () => {
      const action = new basketActions.LoadBasketEligiblePaymentMethods();
      const completion = new basketActions.LoadBasketEligiblePaymentMethodsSuccess([BasketMockData.getPaymentMethod()]);
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadBasketEligiblePaymentMethods$).toBeObservable(expected$);
    });

    it('should map invalid request to action of type LoadBasketEligiblePaymentMethodsFail', () => {
      when(basketServiceMock.getBasketPaymentOptions(anyString())).thenReturn(throwError({ message: 'invalid' }));
      const action = new basketActions.LoadBasketEligiblePaymentMethods();
      const completion = new basketActions.LoadBasketEligiblePaymentMethodsFail({
        message: 'invalid',
      } as HttpError);
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadBasketEligiblePaymentMethods$).toBeObservable(expected$);
    });
  });

  describe('loadBasketPayments$', () => {
    beforeEach(() => {
      when(basketServiceMock.getBasketPayments(anyString())).thenReturn(of([]));

      store$.dispatch(
        new basketActions.LoadBasketSuccess({
          id: 'BID',
          lineItems: [],
          payment: undefined,
        } as Basket)
      );
    });

    it('should call the basketService for loadBasketPayments', done => {
      const payload = 'BID';
      const action = new basketActions.LoadBasketPayments(payload);
      actions$ = of(action);

      effects.loadBasketPayments$.subscribe(() => {
        verify(basketServiceMock.getBasketPayments(payload)).once();
        done();
      });
    });

    it('should map to action of type LoadBasketPaymentsSuccess', () => {
      const payload = 'BID';
      const action = new basketActions.LoadBasketPayments(payload);
      const completion = new basketActions.LoadBasketPaymentsSuccess([] as PaymentMethod[]);
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadBasketPayments$).toBeObservable(expected$);
    });

    it('should map invalid request to action of type LoadBasketPaymentsFail', () => {
      when(basketServiceMock.getBasketPayments(anyString())).thenReturn(throwError({ message: 'invalid' }));
      const action = new basketActions.LoadBasketPayments('BID');
      const completion = new basketActions.LoadBasketPaymentsFail({ message: 'invalid' } as HttpError);
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadBasketPayments$).toBeObservable(expected$);
    });

    it('should trigger LoadBasketPayments action if LoadBasketSuccess action triggered', () => {
      const action = new basketActions.LoadBasketSuccess({
        id: 'BID',
      } as Basket);
      const completion = new basketActions.LoadBasketPayments('BID');
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadBasketPaymentsAfterBasketLoad$).toBeObservable(expected$);
    });
  });

  describe('setPaymentAtBasket$ - set payment at basket for the first time', () => {
    beforeEach(() => {
      when(basketServiceMock.addBasketPayment(anyString(), anyString())).thenReturn(of(undefined));

      store$.dispatch(
        new basketActions.LoadBasketSuccess({
          id: 'BID',
          lineItems: [],
          payment: undefined,
        } as Basket)
      );
    });

    it('should call the basketService for setPaymentAtBasket', done => {
      const payload = 'newPayment';
      const action = new basketActions.SetBasketPayment(payload);
      actions$ = of(action);

      effects.setPaymentAtBasket$.subscribe(() => {
        verify(basketServiceMock.addBasketPayment('BID', payload)).once();
        done();
      });
    });

    it('should map to action of type SetBasketPaymentSuccess', () => {
      const payload = 'newPayment';
      const action = new basketActions.SetBasketPayment(payload);
      const completion = new basketActions.SetBasketPaymentSuccess();
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.setPaymentAtBasket$).toBeObservable(expected$);
    });

    it('should map invalid request to action of type SetPaymentFail', () => {
      when(basketServiceMock.addBasketPayment(anyString(), anyString())).thenReturn(throwError({ message: 'invalid' }));
      const action = new basketActions.SetBasketPayment('newPayment');
      const completion = new basketActions.SetBasketPaymentFail({ message: 'invalid' } as HttpError);
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.setPaymentAtBasket$).toBeObservable(expected$);
    });
  });

  describe('setPaymentAtBasket$ - change payment method at basket', () => {
    beforeEach(() => {
      when(basketServiceMock.addBasketPayment(anyString(), anyString())).thenReturn(of(undefined));
      when(basketServiceMock.deleteBasketPayment(anyString(), anyString())).thenReturn(of(undefined));

      store$.dispatch(
        new basketActions.LoadBasketSuccess({
          id: 'BID',
          lineItems: [],
          payment: {
            id: 'paymentId',
            name: 'paymentName',
          },
        } as Basket)
      );

      store$.dispatch(
        new basketActions.LoadBasketPaymentsSuccess([
          {
            id: 'paymentId',
            name: 'paymentName',
          } as PaymentMethod,
        ])
      );
    });

    it('should call the basketService for setPaymentAtBasket', done => {
      const payload = 'newPayment';
      const action = new basketActions.SetBasketPayment(payload);
      actions$ = of(action);

      effects.setPaymentAtBasket$.subscribe(() => {
        verify(basketServiceMock.deleteBasketPayment('BID', 'paymentId')).once();
        verify(basketServiceMock.addBasketPayment('BID', payload)).once();
        done();
      });
    });

    it('should map to action of type SetBasketPaymentSuccess', () => {
      const payload = 'newPayment';
      const action = new basketActions.SetBasketPayment(payload);
      const completion = new basketActions.SetBasketPaymentSuccess();
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.setPaymentAtBasket$).toBeObservable(expected$);
    });

    it('should map invalid addBasketPayment request to action of type SetPaymentFail', () => {
      when(basketServiceMock.addBasketPayment(anyString(), anyString())).thenReturn(throwError({ message: 'invalid' }));
      const action = new basketActions.SetBasketPayment('newPayment');
      const completion = new basketActions.SetBasketPaymentFail({ message: 'invalid' } as HttpError);
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.setPaymentAtBasket$).toBeObservable(expected$);
    });

    it('should map invalid deleteBasketPayment request to action of type SetPaymentFail', () => {
      when(basketServiceMock.deleteBasketPayment(anyString(), anyString())).thenReturn(
        throwError({ message: 'invalid' })
      );
      const action = new basketActions.SetBasketPayment('newPayment');
      const completion = new basketActions.SetBasketPaymentFail({ message: 'invalid' } as HttpError);
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.setPaymentAtBasket$).toBeObservable(expected$);
    });
  });

  describe('resetBasketAfterLogout$', () => {
    it('should map to action of type ResetBasket if LogoutUser action triggered', () => {
      const action = new LogoutUser();
      const completion = new basketActions.ResetBasket();
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.resetBasketAfterLogout$).toBeObservable(expected$);
    });
  });

  describe('createOrder$', () => {
    it('should call the orderService for createOrder', done => {
      when(orderServiceMock.createOrder(anything(), anything())).thenReturn(of(undefined));
      const payload = BasketMockData.getBasket();
      const action = new basketActions.CreateOrder(payload);
      actions$ = of(action);

      effects.createOrder$.subscribe(() => {
        verify(orderServiceMock.createOrder(payload, true)).once();
        done();
      });
    });

    it('should map a valid request to action of type CreateOrderSuccess', () => {
      when(orderServiceMock.createOrder(anything(), anything())).thenReturn(
        of({ id: BasketMockData.getBasket().id } as Order)
      );
      const payload = BasketMockData.getBasket();
      const order = { id: payload.id } as Order;
      const action = new basketActions.CreateOrder(payload);
      const completion = new basketActions.CreateOrderSuccess(order);
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.createOrder$).toBeObservable(expected$);
    });

    it('should map an invalid request to action of type CreateOrderFail', () => {
      when(orderServiceMock.createOrder(anything(), anything())).thenReturn(throwError({ message: 'invalid' }));
      const payload = BasketMockData.getBasket();
      const action = new basketActions.CreateOrder(payload);
      const completion = new basketActions.CreateOrderFail({ message: 'invalid' } as HttpError);
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.createOrder$).toBeObservable(expected$);
    });
  });

  describe('goToCheckoutReceiptPageAfterOrderCreation', () => {
    it('should navigate to /checkout/receipt after CreateOrderSuccess', done => {
      const action = new basketActions.CreateOrderSuccess({ id: '123' } as Order);
      actions$ = of(action);

      effects.goToCheckoutReceiptPageAfterOrderCreation$.subscribe(() => {
        verify(routerMock.navigate(anything())).once();
        const [param] = capture(routerMock.navigate).last();
        expect(param).toEqual(['/checkout/receipt']);
        done();
      });
    });
  });
});
