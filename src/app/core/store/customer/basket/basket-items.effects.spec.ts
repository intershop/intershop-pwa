import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action, Store } from '@ngrx/store';
import { cold, hot } from 'jest-marbles';
import { Observable, of, throwError } from 'rxjs';
import { anyString, anything, capture, instance, mock, verify, when } from 'ts-mockito';

import { BasketInfo } from 'ish-core/models/basket-info/basket-info.model';
import { Basket } from 'ish-core/models/basket/basket.model';
import { LineItem } from 'ish-core/models/line-item/line-item.model';
import { Product } from 'ish-core/models/product/product.model';
import { AddressService } from 'ish-core/services/address/address.service';
import { BasketService } from 'ish-core/services/basket/basket.service';
import { OrderService } from 'ish-core/services/order/order.service';
import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { CustomerStoreModule } from 'ish-core/store/customer/customer-store.module';
import { loadProduct, loadProductSuccess } from 'ish-core/store/shopping/products';
import { ShoppingStoreModule } from 'ish-core/store/shopping/shopping-store.module';
import { makeHttpError } from 'ish-core/utils/dev/api-service-utils';

import { BasketItemsEffects } from './basket-items.effects';
import {
  addItemsToBasket,
  addItemsToBasketFail,
  addItemsToBasketSuccess,
  addProductToBasket,
  deleteBasketItem,
  deleteBasketItemFail,
  deleteBasketItemSuccess,
  loadBasket,
  loadBasketSuccess,
  updateBasketItems,
  updateBasketItemsFail,
  updateBasketItemsSuccess,
  validateBasket,
} from './basket.actions';

describe('Basket Items Effects', () => {
  let actions$: Observable<Action>;
  let basketServiceMock: BasketService;
  let orderServiceMock: OrderService;
  let addressServiceMock: AddressService;
  let effects: BasketItemsEffects;
  let store$: Store;

  beforeEach(() => {
    basketServiceMock = mock(BasketService);
    orderServiceMock = mock(OrderService);
    addressServiceMock = mock(AddressService);

    TestBed.configureTestingModule({
      imports: [
        CoreStoreModule.forTesting(),
        CustomerStoreModule.forTesting('basket'),
        RouterTestingModule,
        ShoppingStoreModule.forTesting('products', 'categories'),
      ],
      providers: [
        BasketItemsEffects,
        provideMockActions(() => actions$),
        { provide: BasketService, useFactory: () => instance(basketServiceMock) },
        { provide: OrderService, useFactory: () => instance(orderServiceMock) },
        { provide: AddressService, useFactory: () => instance(addressServiceMock) },
      ],
    });

    effects = TestBed.inject(BasketItemsEffects);
    store$ = TestBed.inject(Store);
  });

  describe('addProductToBasket$', () => {
    it('should accumulate AddProductToBasket to a single AddItemsToBasket action', () => {
      store$.dispatch(loadProductSuccess({ product: { sku: 'SKU1', packingUnit: 'pcs.' } as Product }));
      store$.dispatch(loadProductSuccess({ product: { sku: 'SKU2', packingUnit: 'pcs.' } as Product }));
      const action1 = addProductToBasket({ sku: 'SKU1', quantity: 1 });
      const action2 = addProductToBasket({ sku: 'SKU2', quantity: 1 });
      const completion = addItemsToBasket({
        items: [
          { sku: 'SKU2', quantity: 2, unit: 'pcs.' },
          { sku: 'SKU1', quantity: 2, unit: 'pcs.' },
        ],
      });
      actions$ = hot('        -b-a-b-a--|', { a: action1, b: action2 });
      const expected$ = cold('----------(c|)', { c: completion });

      expect(effects.addProductToBasket$).toBeObservable(expected$);
    });
  });

  describe('addItemsToBasket$', () => {
    beforeEach(() => {
      when(basketServiceMock.addItemsToBasket(anyString(), anything())).thenReturn(of(undefined));
    });

    it('should call the basketService for addItemsToBasket', done => {
      store$.dispatch(
        loadBasketSuccess({
          basket: {
            id: 'BID',
            lineItems: [],
          } as Basket,
        })
      );

      const items = [{ sku: 'SKU', quantity: 1, unit: 'pcs.' }];
      const action = addItemsToBasket({ items });
      actions$ = of(action);

      effects.addItemsToBasket$.subscribe(() => {
        verify(basketServiceMock.addItemsToBasket('BID', items)).once();
        done();
      });
    });

    it('should call the basketService for addItemsToBasket with specific basketId when basketId set', done => {
      store$.dispatch(
        loadBasketSuccess({
          basket: {
            id: 'BID',
            lineItems: [],
          } as Basket,
        })
      );

      const items = [{ sku: 'SKU', quantity: 1, unit: 'pcs.' }];
      const basketId = 'BID';
      const action = addItemsToBasket({ items, basketId });
      actions$ = of(action);

      effects.addItemsToBasket$.subscribe(() => {
        verify(basketServiceMock.addItemsToBasket('BID', items)).once();
        done();
      });
    });

    it('should not call the basketService for addItemsToBasket if no basket in store', fakeAsync(() => {
      const items = [{ sku: 'SKU', quantity: 1, unit: 'pcs.' }];
      const action = addItemsToBasket({ items });
      actions$ = of(action);

      effects.addItemsToBasket$.subscribe(fail, fail);

      tick(5000);

      verify(basketServiceMock.addItemsToBasket('BID', anything())).never();
    }));

    it('should call the basketService for createBasket when no basket is present', done => {
      when(basketServiceMock.createBasket()).thenReturn(of({} as Basket));

      const items = [{ sku: 'SKU', quantity: 1, unit: 'pcs.' }];
      const action = addItemsToBasket({ items });
      actions$ = of(action);

      effects.createBasketBeforeAddItemsToBasket$.subscribe(() => {
        verify(basketServiceMock.createBasket()).once();
        done();
      });
    });

    it('should map to action of type AddItemsToBasketSuccess', () => {
      store$.dispatch(
        loadBasketSuccess({
          basket: {
            id: 'BID',
            lineItems: [],
          } as Basket,
        })
      );

      const items = [{ sku: 'SKU', quantity: 1, unit: 'pcs.' }];
      const action = addItemsToBasket({ items });
      const completion = addItemsToBasketSuccess({ info: undefined });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.addItemsToBasket$).toBeObservable(expected$);
    });

    it('should map invalid request to action of type AddItemsToBasketFail', () => {
      when(basketServiceMock.addItemsToBasket(anyString(), anything())).thenReturn(
        throwError(makeHttpError({ message: 'invalid' }))
      );

      store$.dispatch(
        loadBasketSuccess({
          basket: {
            id: 'BID',
            lineItems: [],
          } as Basket,
        })
      );

      const items = [{ sku: 'invalid', quantity: 1, unit: 'pcs.' }];
      const action = addItemsToBasket({ items });
      const completion = addItemsToBasketFail({ error: makeHttpError({ message: 'invalid' }) });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.addItemsToBasket$).toBeObservable(expected$);
    });
  });

  describe('loadProductsForAddItemsToBasket$', () => {
    it('should trigger product loading actions for line items if AddItemsToBasket action is triggered', () => {
      when(basketServiceMock.getBasket(anything())).thenReturn(of());

      const items = [{ sku: 'SKU', quantity: 1, unit: 'pcs.' }];
      const action = addItemsToBasket({ items });

      const completion = loadProduct({ sku: 'SKU' });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadProductsForAddItemsToBasket$).toBeObservable(expected$);
    });
  });

  describe('loadBasketAfterAddItemsToBasket$', () => {
    it('should map to action of type LoadBasket if AddItemsToBasketSuccess action triggered', () => {
      const action = addItemsToBasketSuccess({ info: undefined });
      const completion = loadBasket();
      actions$ = hot('-a', { a: action });
      const expected$ = cold('-c', { c: completion });

      expect(effects.loadBasketAfterBasketItemsChangeSuccess$).toBeObservable(expected$);
    });
  });

  describe('updateBasketItems$', () => {
    beforeEach(() => {
      when(basketServiceMock.updateBasketItem(anyString(), anyString(), anything())).thenReturn(of([{} as BasketInfo]));

      store$.dispatch(
        loadBasketSuccess({
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
        lineItemUpdates: [
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
      const action = updateBasketItems(payload);
      actions$ = of(action);

      effects.updateBasketItems$.subscribe(() => {
        verify(basketServiceMock.updateBasketItem('BID', payload.lineItemUpdates[1].itemId, anything())).thrice();
        expect(capture(basketServiceMock.updateBasketItem).first()).toMatchInlineSnapshot(`
          Array [
            "BID",
            "BIID",
            Object {
              "product": undefined,
              "quantity": Object {
                "unit": undefined,
                "value": 2,
              },
            },
          ]
        `);
        expect(capture(basketServiceMock.updateBasketItem).second()).toMatchInlineSnapshot(`
          Array [
            "BID",
            "BIID",
            Object {
              "product": undefined,
              "quantity": Object {
                "unit": undefined,
                "value": 3,
              },
            },
          ]
        `);
        expect(capture(basketServiceMock.updateBasketItem).third()).toMatchInlineSnapshot(`
          Array [
            "BID",
            "BIID",
            Object {
              "product": undefined,
              "quantity": Object {
                "unit": undefined,
                "value": 4,
              },
            },
          ]
        `);
        done();
      });
    });

    it('should call the basketService for deleteBasketItem if quantity = 0', done => {
      when(basketServiceMock.deleteBasketItem(anyString(), anyString())).thenReturn(of());

      const payload = {
        lineItemUpdates: [
          {
            itemId: 'BIID',
            quantity: 0,
          },
        ],
      };
      const action = updateBasketItems(payload);
      actions$ = of(action);

      effects.updateBasketItems$.subscribe(() => {
        verify(basketServiceMock.deleteBasketItem('BID', payload.lineItemUpdates[0].itemId)).once();
        done();
      });
    });

    it('should map to action of type UpdateBasketItemsSuccess', () => {
      const payload = {
        lineItemUpdates: [
          {
            itemId: 'IID',
            quantity: 2,
          },
        ],
      };
      const action = updateBasketItems(payload);
      // tslint:disable-next-line: no-null-keyword
      const completion = updateBasketItemsSuccess({ info: null });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.updateBasketItems$).toBeObservable(expected$);
    });

    it('should map invalid request to action of type UpdateBasketItemsFail', () => {
      when(basketServiceMock.updateBasketItem(anyString(), anyString(), anything())).thenReturn(
        throwError(makeHttpError({ message: 'invalid' }))
      );

      const payload = {
        lineItemUpdates: [
          {
            itemId: 'BIID',
            quantity: 2,
          },
        ],
      };
      const action = updateBasketItems(payload);
      const completion = updateBasketItemsFail({ error: makeHttpError({ message: 'invalid' }) });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.updateBasketItems$).toBeObservable(expected$);
    });
  });

  describe('loadBasketAfterUpdateBasketItem$', () => {
    it('should map to action of type LoadBasket if UpdateBasketItemSuccess action triggered', () => {
      const action = updateBasketItemsSuccess({ info: undefined });
      const completion = loadBasket();
      actions$ = hot('-a', { a: action });
      const expected$ = cold('-c', { c: completion });

      expect(effects.loadBasketAfterBasketItemsChangeSuccess$).toBeObservable(expected$);
    });
  });

  describe('validateBasketAfterUpdateFailure$', () => {
    it('should map to action of type ValidateBasket if UpdateBasketItemFail action triggered', () => {
      const action = updateBasketItemsFail({ error: makeHttpError({ message: 'invalid' }) });
      const completion = validateBasket({ scopes: ['Products'] });
      actions$ = hot('-a', { a: action });
      const expected$ = cold('-c', { c: completion });

      expect(effects.validateBasketAfterUpdateFailure$).toBeObservable(expected$);
    });
  });

  describe('deleteBasketItem$', () => {
    beforeEach(() => {
      when(basketServiceMock.deleteBasketItem(anyString(), anyString())).thenReturn(of(undefined));

      store$.dispatch(
        loadBasketSuccess({
          basket: {
            id: 'BID',
            lineItems: [],
          } as Basket,
        })
      );
    });

    it('should call the basketService for DeleteBasketItem action', done => {
      const itemId = 'BIID';
      const action = deleteBasketItem({ itemId });
      actions$ = of(action);

      effects.deleteBasketItem$.subscribe(() => {
        verify(basketServiceMock.deleteBasketItem('BID', 'BIID')).once();
        done();
      });
    });

    it('should map to action of type DeleteBasketItemSuccess', () => {
      const itemId = 'BIID';
      const action = deleteBasketItem({ itemId });
      const completion = deleteBasketItemSuccess({ info: undefined });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.deleteBasketItem$).toBeObservable(expected$);
    });

    it('should map invalid request to action of type DeleteBasketItemFail', () => {
      when(basketServiceMock.deleteBasketItem(anyString(), anyString())).thenReturn(
        throwError(makeHttpError({ message: 'invalid' }))
      );

      const itemId = 'BIID';
      const action = deleteBasketItem({ itemId });
      const completion = deleteBasketItemFail({ error: makeHttpError({ message: 'invalid' }) });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.deleteBasketItem$).toBeObservable(expected$);
    });
  });

  describe('loadBasketAfterDeleteBasketItem$', () => {
    it('should map to action of type LoadBasket if DeleteBasketItemSuccess action triggered', () => {
      const action = deleteBasketItemSuccess({ info: undefined });
      const completion = loadBasket();
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadBasketAfterBasketItemsChangeSuccess$).toBeObservable(expected$);
    });
  });
});
