import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action, Store, StoreModule, combineReducers } from '@ngrx/store';
import { cold, hot } from 'jest-marbles';
import { Observable, of, throwError } from 'rxjs';
import { anyString, anything, capture, deepEqual, instance, mock, verify, when } from 'ts-mockito';

import { BasketBaseData } from 'ish-core/models/basket/basket.interface';
import { Basket } from 'ish-core/models/basket/basket.model';
import { Customer } from 'ish-core/models/customer/customer.model';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { LineItem } from 'ish-core/models/line-item/line-item.model';
import { Link } from 'ish-core/models/link/link.model';
import { Order } from 'ish-core/models/order/order.model';
import { PaymentMethod } from 'ish-core/models/payment-method/payment-method.model';
import { Product } from 'ish-core/models/product/product.model';
import { LoginUserSuccess, LogoutUser } from 'ish-core/store/user/user.actions';
import { BasketMockData } from 'ish-core/utils/dev/basket-mock-data';
import { AddressService } from '../../../services/address/address.service';
import { BasketService } from '../../../services/basket/basket.service';
import { OrderService } from '../../../services/order/order.service';
import { LoadProduct, LoadProductSuccess } from '../../shopping/products';
import { shoppingReducers } from '../../shopping/shopping-store.module';
import {
  DeleteCustomerAddressFail,
  DeleteCustomerAddressSuccess,
  UpdateCustomerAddressFail,
  UpdateCustomerAddressSuccess,
} from '../addresses/addresses.actions';
import { checkoutReducers } from '../checkout-store.module';

import * as basketActions from './basket.actions';
import { BasketEffects } from './basket.effects';

describe('Basket Effects', () => {
  let actions$: Observable<Action>;
  let basketServiceMock: BasketService;
  let orderServiceMock: OrderService;
  let addressServiceMock: AddressService;
  let effects: BasketEffects;
  let routerMock: Router;
  let store$: Store<{}>;

  beforeEach(() => {
    routerMock = mock(Router);
    basketServiceMock = mock(BasketService);
    orderServiceMock = mock(OrderService);
    addressServiceMock = mock(AddressService);

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
        { provide: AddressService, useFactory: () => instance(addressServiceMock) },
        { provide: Router, useFactory: () => instance(routerMock) },
      ],
    });

    effects = TestBed.get(BasketEffects);
    store$ = TestBed.get(Store);
  });

  describe('loadBasket$', () => {
    beforeEach(() => {
      when(basketServiceMock.getBasket(anyString())).thenCall((id: string) => of({ id } as Basket));
    });

    it('should call the basketService for loadBasket', done => {
      const id = 'BID';
      const action = new basketActions.LoadBasket({ id });
      actions$ = of(action);

      effects.loadBasket$.subscribe(() => {
        verify(basketServiceMock.getBasket(id)).once();
        done();
      });
    });

    it('should map to action of type LoadBasketSuccess', () => {
      const id = 'BID';
      const action = new basketActions.LoadBasket({ id });
      const completion = new basketActions.LoadBasketSuccess({ basket: { id } as Basket });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadBasket$).toBeObservable(expected$);
    });

    it('should map invalid request to action of type LoadBasketFail', () => {
      when(basketServiceMock.getBasket(anyString())).thenReturn(throwError({ message: 'invalid' }));
      const action = new basketActions.LoadBasket({ id: 'BID' });
      const completion = new basketActions.LoadBasketFail({ error: { message: 'invalid' } as HttpError });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadBasket$).toBeObservable(expected$);
    });
  });

  describe('loadProductsForBasket$', () => {
    it('should trigger LoadProduct actions for line items if LoadBasketSuccess action triggered', () => {
      when(basketServiceMock.getBasket(anything(), anyString())).thenReturn(of());

      const action = new basketActions.LoadBasketSuccess({
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

      const completion = new LoadProduct({ sku: 'SKU' });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadProductsForBasket$).toBeObservable(expected$);
    });
  });

  describe('createCustomerInvoiceAddress$', () => {
    beforeEach(() => {
      when(addressServiceMock.createCustomerAddress('-', anything())).thenReturn(of(BasketMockData.getAddress()));
    });
    it('should call the addressService for createCustomerInvoiceAddress', done => {
      const address = BasketMockData.getAddress();
      const action = new basketActions.CreateBasketInvoiceAddress({ address });
      actions$ = of(action);

      effects.createCustomerAddressForBasket$.subscribe(() => {
        verify(addressServiceMock.createCustomerAddress('-', anything())).once();
        done();
      });
    });

    it('should map to Action createCustomerInvoiceAddressSuccess', () => {
      const address = BasketMockData.getAddress();
      const action = new basketActions.CreateBasketInvoiceAddress({ address });
      const completion = new basketActions.CreateBasketInvoiceAddressSuccess({ address });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.createCustomerAddressForBasket$).toBeObservable(expected$);
    });
  });

  describe('updateBasketWithNewInvoiceAddress$', () => {
    it('should map to Action UpdateBasketInvoiceAddress', () => {
      const address = BasketMockData.getAddress();
      const action = new basketActions.CreateBasketInvoiceAddressSuccess({ address });
      const completion = new basketActions.UpdateBasketInvoiceAddress({ addressId: address.id });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.updateBasketWithNewAddress$).toBeObservable(expected$);
    });
  });

  describe('createCustomerShippingAddress$', () => {
    beforeEach(() => {
      when(addressServiceMock.createCustomerAddress('-', anything())).thenReturn(of(BasketMockData.getAddress()));
    });
    it('should call the addressService for createCustomerShippingAddress', done => {
      const address = BasketMockData.getAddress();
      const action = new basketActions.CreateBasketShippingAddress({ address });
      actions$ = of(action);

      effects.createCustomerAddressForBasket$.subscribe(() => {
        verify(addressServiceMock.createCustomerAddress('-', anything())).once();
        done();
      });
    });

    it('should map to Action createCustomerShippingAddressSuccess', () => {
      const address = BasketMockData.getAddress();
      const action = new basketActions.CreateBasketShippingAddress({ address });
      const completion = new basketActions.CreateBasketShippingAddressSuccess({ address });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.createCustomerAddressForBasket$).toBeObservable(expected$);
    });
  });

  describe('updateBasketWithNewShippingAddress$', () => {
    it('should map to Action UpdateBasketShippingAddress', () => {
      const address = BasketMockData.getAddress();
      const action = new basketActions.CreateBasketShippingAddressSuccess({ address });
      const completion = new basketActions.UpdateBasketShippingAddress({ addressId: address.id });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.updateBasketWithNewAddress$).toBeObservable(expected$);
    });
  });

  describe('updateBasket$', () => {
    beforeEach(() => {
      when(basketServiceMock.updateBasket(anyString(), anything())).thenReturn(of(undefined));

      store$.dispatch(
        new basketActions.LoadBasketSuccess({
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
      const action = new basketActions.UpdateBasket({ update });
      actions$ = of(action);

      effects.updateBasket$.subscribe(() => {
        verify(basketServiceMock.updateBasket(basketId, update)).once();
        done();
      });
    });

    it('should map to action of type UpdateBasketSuccess', () => {
      const update = { commonShippingMethod: 'shippingId' };
      const action = new basketActions.UpdateBasket({ update });
      const completion = new basketActions.UpdateBasketSuccess();
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.updateBasket$).toBeObservable(expected$);
    });

    it('should map invalid request to action of type UpdateBasketFail', () => {
      const update = { commonShippingMethod: 'shippingId' };
      when(basketServiceMock.updateBasket(anyString(), anything())).thenReturn(throwError({ message: 'invalid' }));

      const action = new basketActions.UpdateBasket({ update });
      const completion = new basketActions.UpdateBasketFail({ error: { message: 'invalid' } as HttpError });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.updateBasket$).toBeObservable(expected$);
    });
  });

  describe('updateBasketShippingMethod$', () => {
    it('should trigger the updateBasket action if called', () => {
      const shippingId = 'shippingId';
      const action = new basketActions.UpdateBasketShippingMethod({ shippingId });
      const completion = new basketActions.UpdateBasket({
        update: { commonShippingMethod: shippingId },
      });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.updateBasketShippingMethod$).toBeObservable(expected$);
    });
  });

  describe('updateBasketCustomerAddress$', () => {
    beforeEach(() => {
      when(addressServiceMock.updateCustomerAddress(anyString(), anything())).thenReturn(
        of(BasketMockData.getAddress())
      );
    });

    it('should call the addressService for updateBasketCustomerAddress', done => {
      const address = BasketMockData.getAddress();
      const action = new basketActions.UpdateBasketCustomerAddress({ address });
      actions$ = of(action);

      effects.updateBasketCustomerAddress$.subscribe(() => {
        verify(addressServiceMock.updateCustomerAddress('-', anything())).once();
        done();
      });
    });

    it('should map to action of type UpdateCustomerAddressSuccess and LoadBasket', () => {
      const address = BasketMockData.getAddress();
      const action = new basketActions.UpdateBasketCustomerAddress({ address });
      const completion1 = new UpdateCustomerAddressSuccess({ address });
      const completion2 = new basketActions.LoadBasket();
      actions$ = hot('-a', { a: action });
      const expected$ = cold('-(cd)', { c: completion1, d: completion2 });

      expect(effects.updateBasketCustomerAddress$).toBeObservable(expected$);
    });

    it('should map invalid request to action of type UpdateCustomerAddressFail', () => {
      const address = BasketMockData.getAddress();
      when(addressServiceMock.updateCustomerAddress(anyString(), anything())).thenReturn(
        throwError({ message: 'invalid' })
      );

      const action = new basketActions.UpdateBasketCustomerAddress({ address });
      const completion = new UpdateCustomerAddressFail({ error: { message: 'invalid' } as HttpError });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.updateBasketCustomerAddress$).toBeObservable(expected$);
    });
  });

  describe('deleteBasketShippingAddress$', () => {
    beforeEach(() => {
      when(addressServiceMock.deleteCustomerAddress(anyString(), anyString())).thenReturn(of(undefined));
    });

    it('should call the addressService for deleteBasketShippingAddress', done => {
      const addressId = 'addressId';
      const action = new basketActions.DeleteBasketShippingAddress({ addressId });
      actions$ = of(action);

      effects.deleteBasketShippingAddress$.subscribe(() => {
        verify(addressServiceMock.deleteCustomerAddress('-', anything())).once();
        done();
      });
    });

    it('should map to action of type DeleteCustomerAddressSuccess and LoadBasket', () => {
      const addressId = 'addressId';
      const action = new basketActions.DeleteBasketShippingAddress({ addressId });
      const completion1 = new DeleteCustomerAddressSuccess({ addressId });
      const completion2 = new basketActions.LoadBasket();
      actions$ = hot('-a', { a: action });
      const expected$ = cold('-(cd)', { c: completion1, d: completion2 });

      expect(effects.deleteBasketShippingAddress$).toBeObservable(expected$);
    });

    it('should map invalid request to action of type DeleteCustomerAddressFail', () => {
      const addressId = 'addressId';
      when(addressServiceMock.deleteCustomerAddress(anyString(), anyString())).thenReturn(
        throwError({ message: 'invalid' })
      );

      const action = new basketActions.DeleteBasketShippingAddress({ addressId });
      const completion = new DeleteCustomerAddressFail({ error: { message: 'invalid' } as HttpError });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.deleteBasketShippingAddress$).toBeObservable(expected$);
    });
  });

  describe('addItemsToBasket$', () => {
    beforeEach(() => {
      when(basketServiceMock.addItemsToBasket(anyString(), anything())).thenReturn(of(undefined));
    });

    it('should call the basketService for addItemsToBasket', done => {
      store$.dispatch(
        new basketActions.LoadBasketSuccess({
          basket: {
            id: 'BID',
            lineItems: [],
          } as Basket,
        })
      );

      const items = [{ sku: 'SKU', quantity: 1 }];
      const action = new basketActions.AddItemsToBasket({ items });
      actions$ = of(action);

      effects.addItemsToBasket$.subscribe(() => {
        verify(basketServiceMock.addItemsToBasket('BID', items)).once();
        done();
      });
    });

    it('should call the basketService for addItemsToBasket with specific basketId when basketId set', done => {
      store$.dispatch(
        new basketActions.LoadBasketSuccess({
          basket: {
            id: 'BID',
            lineItems: [],
          } as Basket,
        })
      );

      const items = [{ sku: 'SKU', quantity: 1 }];
      const basketId = 'BID';
      const action = new basketActions.AddItemsToBasket({ items, basketId });
      actions$ = of(action);

      effects.addItemsToBasket$.subscribe(() => {
        verify(basketServiceMock.addItemsToBasket('BID', items)).once();
        done();
      });
    });

    it('should not call the basketService for addItemsToBasket if no basket in store', () => {
      const items = [{ sku: 'SKU', quantity: 1 }];
      const action = new basketActions.AddItemsToBasket({ items });
      actions$ = of(action);

      effects.addItemsToBasket$.subscribe(fail, fail);

      verify(basketServiceMock.addItemsToBasket('BID', anything())).never();
    });

    it('should call the basketService for createBasket when no basket is present', done => {
      when(basketServiceMock.createBasket()).thenReturn(of({} as Basket));

      const items = [{ sku: 'SKU', quantity: 1 }];
      const action = new basketActions.AddItemsToBasket({ items });
      actions$ = of(action);

      effects.createBasketBeforeAddItemsToBasket$.subscribe(() => {
        verify(basketServiceMock.createBasket()).once();
        done();
      });
    });

    it('should map to action of type AddItemsToBasketSuccess', () => {
      store$.dispatch(
        new basketActions.LoadBasketSuccess({
          basket: {
            id: 'BID',
            lineItems: [],
          } as Basket,
        })
      );

      const items = [{ sku: 'SKU', quantity: 1 }];
      const action = new basketActions.AddItemsToBasket({ items });
      const completion = new basketActions.AddItemsToBasketSuccess();
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.addItemsToBasket$).toBeObservable(expected$);
    });

    it('should map invalid request to action of type AddItemsToBasketFail', () => {
      when(basketServiceMock.addItemsToBasket(anyString(), anything())).thenReturn(throwError({ message: 'invalid' }));

      store$.dispatch(
        new basketActions.LoadBasketSuccess({
          basket: {
            id: 'BID',
            lineItems: [],
          } as Basket,
        })
      );

      const items = [{ sku: 'invalid', quantity: 1 }];
      const action = new basketActions.AddItemsToBasket({ items });
      const completion = new basketActions.AddItemsToBasketFail({ error: { message: 'invalid' } as HttpError });
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
          basket: {
            id: 'BID',
            lineItems: [],
          } as Basket,
        })
      );

      const quoteId = 'QID';
      const action = new basketActions.AddQuoteToBasket({ quoteId });
      actions$ = of(action);

      effects.addQuoteToBasket$.subscribe(() => {
        verify(basketServiceMock.addQuoteToBasket(quoteId, 'BID')).once();
        done();
      });
    });

    it('should call the basketService for createBasket if no basket is present', done => {
      when(basketServiceMock.createBasket()).thenReturn(of({} as Basket));

      const quoteId = 'quoteId';
      const action = new basketActions.AddQuoteToBasket({ quoteId });
      actions$ = of(action);

      effects.getBasketBeforeAddQuoteToBasket$.subscribe(() => {
        verify(basketServiceMock.createBasket()).once();
        done();
      });
    });

    it('should map to action of type AddQuoteToBasketSuccess', () => {
      when(basketServiceMock.addQuoteToBasket(anyString(), anyString())).thenReturn(of({} as Link));

      store$.dispatch(
        new basketActions.LoadBasketSuccess({
          basket: {
            id: 'BID',
            lineItems: [],
          } as Basket,
        })
      );

      const quoteId = 'QID';
      const action = new basketActions.AddQuoteToBasket({ quoteId });
      const completion = new basketActions.AddQuoteToBasketSuccess({ link: {} as Link });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.addQuoteToBasket$).toBeObservable(expected$);
    });

    it('should map invalid request to action of type AddQuoteToBasketFail', () => {
      when(basketServiceMock.addQuoteToBasket(anyString(), anyString())).thenReturn(throwError({ message: 'invalid' }));

      store$.dispatch(
        new basketActions.LoadBasketSuccess({
          basket: {
            id: 'BID',
            lineItems: [],
          } as Basket,
        })
      );

      const quoteId = 'QID';
      const action = new basketActions.AddQuoteToBasket({ quoteId });
      const completion = new basketActions.AddQuoteToBasketFail({ error: { message: 'invalid' } as HttpError });
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
      when(basketServiceMock.getBaskets()).thenReturn(of([{ id: 'BIDNEW' } as BasketBaseData]));

      store$.dispatch(
        new basketActions.LoadBasketSuccess({
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

      const action = new LoginUserSuccess({ customer: {} as Customer });
      const completion = new basketActions.AddItemsToBasket({
        items: [
          {
            sku: 'SKU',
            quantity: 1,
          },
        ],
        basketId: 'BIDNEW',
      });
      actions$ = hot('-a', { a: action });
      const expected$ = cold('-c', { c: completion });

      expect(effects.mergeBasketAfterLogin$).toBeObservable(expected$);
    });
  });

  describe('loadBasketAfterLogin$', () => {
    it('should map to action of type LoadBasket if pre login basket is empty', () => {
      when(basketServiceMock.getBaskets()).thenReturn(of([{ id: 'BIDNEW' } as BasketBaseData]));

      const action = new LoginUserSuccess({ customer: {} as Customer });
      const completion = new basketActions.LoadBasket();
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadBasketAfterLogin$).toBeObservable(expected$);
    });
  });

  describe('updateBasketItems$', () => {
    beforeEach(() => {
      when(basketServiceMock.updateBasketItem(anyString(), anyString(), anything())).thenReturn(of());

      store$.dispatch(
        new basketActions.LoadBasketSuccess({
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
    });

    it('should call the basketService for updateBasketItem if quantity > 0', done => {
      const payload = {
        lineItemQuantities: [
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
        ],
      };
      const action = new basketActions.UpdateBasketItems(payload);
      actions$ = of(action);

      effects.updateBasketItems$.subscribe(() => {
        verify(basketServiceMock.updateBasketItem('BID', payload.lineItemQuantities[1].itemId, anything())).thrice();
        verify(
          basketServiceMock.updateBasketItem(
            'BID',
            payload.lineItemQuantities[1].itemId,
            deepEqual({ quantity: { value: 2 } })
          )
        ).once();
        done();
      });
    });

    it('should call the basketService for deleteBasketItem if quantity = 0', done => {
      when(basketServiceMock.deleteBasketItem(anyString(), anyString())).thenReturn(of());

      const payload = {
        lineItemQuantities: [
          {
            itemId: 'BIID',
            quantity: 0,
          },
        ],
      };
      const action = new basketActions.UpdateBasketItems(payload);
      actions$ = of(action);

      effects.updateBasketItems$.subscribe(() => {
        verify(basketServiceMock.deleteBasketItem('BID', payload.lineItemQuantities[0].itemId)).once();
        done();
      });
    });

    it('should map to action of type UpdateBasketItemsSuccess', () => {
      const payload = {
        lineItemQuantities: [
          {
            itemId: 'IID',
            quantity: 2,
          },
        ],
      };
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

      const payload = {
        lineItemQuantities: [
          {
            itemId: 'BIID',
            quantity: 2,
          },
        ],
      };
      const action = new basketActions.UpdateBasketItems(payload);
      const completion = new basketActions.UpdateBasketItemsFail({ error: { message: 'invalid' } as HttpError });
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
          basket: {
            id: 'BID',
            lineItems: [],
          } as Basket,
        })
      );
    });

    it('should call the basketService for DeleteBasketItem action', done => {
      const itemId = 'BIID';
      const action = new basketActions.DeleteBasketItem({ itemId });
      actions$ = of(action);

      effects.deleteBasketItem$.subscribe(() => {
        verify(basketServiceMock.deleteBasketItem('BID', 'BIID')).once();
        done();
      });
    });

    it('should map to action of type DeleteBasketItemSuccess', () => {
      const itemId = 'BIID';
      const action = new basketActions.DeleteBasketItem({ itemId });
      const completion = new basketActions.DeleteBasketItemSuccess();
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.deleteBasketItem$).toBeObservable(expected$);
    });

    it('should map invalid request to action of type DeleteBasketItemFail', () => {
      when(basketServiceMock.deleteBasketItem(anyString(), anyString())).thenReturn(throwError({ message: 'invalid' }));

      const itemId = 'BIID';
      const action = new basketActions.DeleteBasketItem({ itemId });
      const completion = new basketActions.DeleteBasketItemFail({ error: { message: 'invalid' } as HttpError });
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
      when(basketServiceMock.getBasketEligibleShippingMethods(anyString())).thenReturn(
        of([BasketMockData.getShippingMethod()])
      );

      store$.dispatch(
        new basketActions.LoadBasketSuccess({
          basket: {
            id: 'BID',
            lineItems: [],
          } as Basket,
        })
      );
    });

    it('should call the basketService for loadBasketItemOptions', done => {
      const action = new basketActions.LoadBasketEligibleShippingMethods();
      actions$ = of(action);

      effects.loadBasketEligibleShippingMethods$.subscribe(() => {
        verify(basketServiceMock.getBasketEligibleShippingMethods('BID')).once();
        done();
      });
    });

    it('should map to action of type loadBasketEligibleShippingMethodsSuccess', () => {
      const action = new basketActions.LoadBasketEligibleShippingMethods();
      const completion = new basketActions.LoadBasketEligibleShippingMethodsSuccess({
        shippingMethods: [BasketMockData.getShippingMethod()],
      });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadBasketEligibleShippingMethods$).toBeObservable(expected$);
    });

    it('should map invalid request to action of type LoadBasketEligibleShippingMethodsFail', () => {
      when(basketServiceMock.getBasketEligibleShippingMethods(anyString())).thenReturn(
        throwError({ message: 'invalid' })
      );
      const action = new basketActions.LoadBasketEligibleShippingMethods();
      const completion = new basketActions.LoadBasketEligibleShippingMethodsFail({
        error: {
          message: 'invalid',
        } as HttpError,
      });
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
          basket: {
            id: 'BID',
            lineItems: [],
          } as Basket,
        })
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
      const completion = new basketActions.LoadBasketEligiblePaymentMethodsSuccess({
        paymentMethods: [BasketMockData.getPaymentMethod()],
      });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadBasketEligiblePaymentMethods$).toBeObservable(expected$);
    });

    it('should map invalid request to action of type LoadBasketEligiblePaymentMethodsFail', () => {
      when(basketServiceMock.getBasketPaymentOptions(anyString())).thenReturn(throwError({ message: 'invalid' }));
      const action = new basketActions.LoadBasketEligiblePaymentMethods();
      const completion = new basketActions.LoadBasketEligiblePaymentMethodsFail({
        error: {
          message: 'invalid',
        } as HttpError,
      });
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
          basket: {
            id: 'BID',
            lineItems: [],
            payment: undefined,
          } as Basket,
        })
      );
    });

    it('should call the basketService for loadBasketPayments', done => {
      const id = 'BID';
      const action = new basketActions.LoadBasketPayments({ id });
      actions$ = of(action);

      effects.loadBasketPayments$.subscribe(() => {
        verify(basketServiceMock.getBasketPayments(id)).once();
        done();
      });
    });

    it('should map to action of type LoadBasketPaymentsSuccess', () => {
      const id = 'BID';
      const action = new basketActions.LoadBasketPayments({ id });
      const completion = new basketActions.LoadBasketPaymentsSuccess({ paymentMethods: [] as PaymentMethod[] });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadBasketPayments$).toBeObservable(expected$);
    });

    it('should map invalid request to action of type LoadBasketPaymentsFail', () => {
      when(basketServiceMock.getBasketPayments(anyString())).thenReturn(throwError({ message: 'invalid' }));
      const action = new basketActions.LoadBasketPayments({ id: 'BID' });
      const completion = new basketActions.LoadBasketPaymentsFail({ error: { message: 'invalid' } as HttpError });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadBasketPayments$).toBeObservable(expected$);
    });

    it('should trigger LoadBasketPayments action if LoadBasketSuccess action triggered', () => {
      const action = new basketActions.LoadBasketSuccess({
        basket: {
          id: 'BID',
        } as Basket,
      });
      const completion = new basketActions.LoadBasketPayments({ id: 'BID' });
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
          basket: {
            id: 'BID',
            lineItems: [],
            payment: undefined,
          } as Basket,
        })
      );
    });

    it('should call the basketService for setPaymentAtBasket', done => {
      const id = 'newPayment';
      const action = new basketActions.SetBasketPayment({ id });
      actions$ = of(action);

      effects.setPaymentAtBasket$.subscribe(() => {
        verify(basketServiceMock.addBasketPayment('BID', id)).once();
        done();
      });
    });

    it('should map to action of type SetBasketPaymentSuccess', () => {
      const id = 'newPayment';
      const action = new basketActions.SetBasketPayment({ id });
      const completion = new basketActions.SetBasketPaymentSuccess();
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.setPaymentAtBasket$).toBeObservable(expected$);
    });

    it('should map invalid request to action of type SetPaymentFail', () => {
      when(basketServiceMock.addBasketPayment(anyString(), anyString())).thenReturn(throwError({ message: 'invalid' }));
      const action = new basketActions.SetBasketPayment({ id: 'newPayment' });
      const completion = new basketActions.SetBasketPaymentFail({ error: { message: 'invalid' } as HttpError });
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
          basket: {
            id: 'BID',
            lineItems: [],
            payment: {
              id: 'paymentId',
              name: 'paymentName',
            },
          } as Basket,
        })
      );

      store$.dispatch(
        new basketActions.LoadBasketPaymentsSuccess({
          paymentMethods: [
            {
              id: 'paymentId',
              name: 'paymentName',
            } as PaymentMethod,
          ],
        })
      );
    });

    it('should call the basketService for setPaymentAtBasket', done => {
      const id = 'newPayment';
      const action = new basketActions.SetBasketPayment({ id });
      actions$ = of(action);

      effects.setPaymentAtBasket$.subscribe(() => {
        verify(basketServiceMock.deleteBasketPayment('BID', 'paymentId')).once();
        verify(basketServiceMock.addBasketPayment('BID', id)).once();
        done();
      });
    });

    it('should map to action of type SetBasketPaymentSuccess', () => {
      const id = 'newPayment';
      const action = new basketActions.SetBasketPayment({ id });
      const completion = new basketActions.SetBasketPaymentSuccess();
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.setPaymentAtBasket$).toBeObservable(expected$);
    });

    it('should map invalid addBasketPayment request to action of type SetPaymentFail', () => {
      when(basketServiceMock.addBasketPayment(anyString(), anyString())).thenReturn(throwError({ message: 'invalid' }));
      const action = new basketActions.SetBasketPayment({ id: 'newPayment' });
      const completion = new basketActions.SetBasketPaymentFail({ error: { message: 'invalid' } as HttpError });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.setPaymentAtBasket$).toBeObservable(expected$);
    });

    it('should map invalid deleteBasketPayment request to action of type SetPaymentFail', () => {
      when(basketServiceMock.deleteBasketPayment(anyString(), anyString())).thenReturn(
        throwError({ message: 'invalid' })
      );
      const action = new basketActions.SetBasketPayment({ id: 'newPayment' });
      const completion = new basketActions.SetBasketPaymentFail({ error: { message: 'invalid' } as HttpError });
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
      const action = new basketActions.CreateOrder({ basket: payload });
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
      const basket = BasketMockData.getBasket();
      const order = { id: basket.id } as Order;
      const action = new basketActions.CreateOrder({ basket });
      const completion = new basketActions.CreateOrderSuccess({ order });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.createOrder$).toBeObservable(expected$);
    });

    it('should map an invalid request to action of type CreateOrderFail', () => {
      when(orderServiceMock.createOrder(anything(), anything())).thenReturn(throwError({ message: 'invalid' }));
      const basket = BasketMockData.getBasket();
      const action = new basketActions.CreateOrder({ basket });
      const completion = new basketActions.CreateOrderFail({ error: { message: 'invalid' } as HttpError });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.createOrder$).toBeObservable(expected$);
    });
  });

  describe('goToCheckoutReceiptPageAfterOrderCreation', () => {
    it('should navigate to /checkout/receipt after CreateOrderSuccess', done => {
      const action = new basketActions.CreateOrderSuccess({ order: { id: '123' } as Order });
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
