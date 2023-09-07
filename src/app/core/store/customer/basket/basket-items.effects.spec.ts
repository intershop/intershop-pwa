import { Location } from '@angular/common';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action, Store } from '@ngrx/store';
import { cold, hot } from 'jasmine-marbles';
import { Observable, noop, of, throwError } from 'rxjs';
import { anyString, anything, capture, instance, mock, verify, when } from 'ts-mockito';

import { BasketInfo } from 'ish-core/models/basket-info/basket-info.model';
import { Basket } from 'ish-core/models/basket/basket.model';
import { LineItem } from 'ish-core/models/line-item/line-item.model';
import { Product } from 'ish-core/models/product/product.model';
import { BasketItemsService } from 'ish-core/services/basket-items/basket-items.service';
import { BasketService } from 'ish-core/services/basket/basket.service';
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
  updateBasketItem,
  updateBasketItemFail,
  updateBasketItemSuccess,
  updateBasketItems,
  updateBasketItemsFail,
  updateBasketItemsSuccess,
  validateBasket,
} from './basket.actions';

describe('Basket Items Effects', () => {
  let actions$: Observable<Action>;
  let basketServiceMock: BasketService;
  let basketItemsServiceMock: BasketItemsService;
  let effects: BasketItemsEffects;
  let store: Store;
  let location: Location;

  beforeEach(() => {
    basketServiceMock = mock(BasketService);
    basketItemsServiceMock = mock(BasketItemsService);

    TestBed.configureTestingModule({
      imports: [
        CoreStoreModule.forTesting(),
        CustomerStoreModule.forTesting('basket'),
        RouterTestingModule.withRoutes([{ path: '**', children: [] }]),
        ShoppingStoreModule.forTesting('products', 'categories'),
      ],
      providers: [
        { provide: BasketItemsService, useFactory: () => instance(basketItemsServiceMock) },
        { provide: BasketService, useFactory: () => instance(basketServiceMock) },
        BasketItemsEffects,
        provideMockActions(() => actions$),
      ],
    });

    effects = TestBed.inject(BasketItemsEffects);
    store = TestBed.inject(Store);
    location = TestBed.inject(Location);
  });

  describe('addProductToBasket$', () => {
    it('should accumulate AddProductToBasket to a single action', () => {
      store.dispatch(loadProductSuccess({ product: { sku: 'SKU1', packingUnit: 'pcs.' } as Product }));
      store.dispatch(loadProductSuccess({ product: { sku: 'SKU2', packingUnit: 'pcs.' } as Product }));
      const action1 = addProductToBasket({ sku: 'SKU1', quantity: 1 });
      const action2 = addProductToBasket({ sku: 'SKU2', quantity: 1 });
      const completion = addItemsToBasket({
        items: [
          { sku: 'SKU2', quantity: 1, unit: 'pcs.' },
          { sku: 'SKU1', quantity: 1, unit: 'pcs.' },
          { sku: 'SKU2', quantity: 1, unit: 'pcs.' },
          { sku: 'SKU1', quantity: 1, unit: 'pcs.' },
        ],
      });
      actions$ = hot('        -b-a-b-a--|', { a: action1, b: action2 });
      const expected$ = cold('----------(c|)', { c: completion });

      expect(effects.addProductToBasket$).toBeObservable(expected$);
    });
  });

  describe('addItemsToBasket$', () => {
    beforeEach(() => {
      when(basketItemsServiceMock.addItemsToBasket(anything())).thenReturn(
        of({ lineItems: [], info: undefined, errors: undefined })
      );
    });

    it('should call the basketItemsService for addItemsToBasket', done => {
      store.dispatch(
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
        verify(basketItemsServiceMock.addItemsToBasket(items)).once();
        done();
      });
    });

    it('should call the basketService for createBasket and call basketItemsService for addItemsToBasket when no basket is present', done => {
      when(basketServiceMock.createBasket()).thenReturn(of({} as Basket));

      const items = [{ sku: 'SKU', quantity: 1, unit: 'pcs.' }];
      const action = addItemsToBasket({ items });
      actions$ = of(action);

      effects.addItemsToBasket$.subscribe(() => {
        verify(basketServiceMock.createBasket()).once();
        verify(basketItemsServiceMock.addItemsToBasket(items)).once();
        done();
      });
    });

    it('should map to action of type AddItemsToBasketSuccess', () => {
      store.dispatch(
        loadBasketSuccess({
          basket: {
            id: 'BID',
            lineItems: [],
          } as Basket,
        })
      );

      const items = [{ sku: 'SKU', quantity: 1, unit: 'pcs.' }];
      const action = addItemsToBasket({ items });
      const completion = addItemsToBasketSuccess({
        info: undefined,
        lineItems: [],
      });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.addItemsToBasket$).toBeObservable(expected$);
    });

    it('should map invalid request to action of type AddItemsToBasketFail', () => {
      when(basketItemsServiceMock.addItemsToBasket(anything())).thenReturn(
        throwError(() => makeHttpError({ message: 'invalid' }))
      );

      store.dispatch(
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
      when(basketServiceMock.getBasket()).thenReturn(of());

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
      const action = addItemsToBasketSuccess({ info: undefined, lineItems: [] });
      const completion = loadBasket();
      actions$ = hot('-a', { a: action });
      const expected$ = cold('-c', { c: completion });

      expect(effects.loadBasketAfterBasketItemsChangeSuccess$).toBeObservable(expected$);
    });
  });

  describe('updateBasketItem$', () => {
    beforeEach(() => {
      when(basketItemsServiceMock.updateBasketItem(anyString(), anything())).thenReturn(
        of({ lineItem: undefined, info: undefined })
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

    const itemId = 'BIID';
    const updateItemAction = updateBasketItem({
      lineItemUpdate: {
        itemId,
        quantity: 2,
      },
    });

    it('should call the basketItemsService for UpdateBasketItem action', done => {
      actions$ = of(updateItemAction);

      effects.updateBasketItem$.subscribe(() => {
        verify(basketItemsServiceMock.updateBasketItem(itemId, anything())).once();
        done();
      });
    });

    it('should map to action of type UpdateBasketItemSuccess', () => {
      const completion = updateBasketItemSuccess({ lineItem: undefined, info: undefined });
      actions$ = hot('-a-a-a', { a: updateItemAction });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.updateBasketItem$).toBeObservable(expected$);
    });

    it('should map invalid request to action of type UpdateBasketItemFail', () => {
      when(basketItemsServiceMock.updateBasketItem(anyString(), anything())).thenReturn(
        throwError(() => makeHttpError({ message: 'invalid' }))
      );

      const completion = updateBasketItemFail({ error: makeHttpError({ message: 'invalid' }) });
      actions$ = hot('-a-a-a', { a: updateItemAction });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.updateBasketItem$).toBeObservable(expected$);
    });
  });

  describe('loadBasketAfterUpdateBasketItem$', () => {
    it('should map to action of type LoadBasket if UpdateBasketItemSuccess action triggered', () => {
      const action = updateBasketItemSuccess({ lineItem: anything(), info: undefined });
      const completion = loadBasket();
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadBasketAfterBasketItemsChangeSuccess$).toBeObservable(expected$);
    });
  });

  describe('updateBasketItems$', () => {
    beforeEach(() => {
      when(basketItemsServiceMock.updateBasketItem(anyString(), anything())).thenReturn(
        of({ lineItem: undefined, info: undefined })
      );

      store.dispatch(
        loadBasketSuccess({
          basket: {
            id: 'BID',
            lineItems: [
              {
                id: 'BIID',
                quantity: { value: 1 },
                productSKU: 'SKU',
                price: undefined,
              } as LineItem,
            ],
          } as Basket,
        })
      );
    });

    it('should call the basketItemsService for updateBasketItem if quantity > 0', done => {
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
        verify(basketItemsServiceMock.updateBasketItem(payload.lineItemUpdates[1].itemId, anything())).thrice();
        expect(capture(basketItemsServiceMock.updateBasketItem).first()).toMatchInlineSnapshot(`
          [
            "BIID",
            {
              "product": undefined,
              "quantity": {
                "unit": undefined,
                "value": 2,
              },
            },
          ]
        `);
        expect(capture(basketItemsServiceMock.updateBasketItem).second()).toMatchInlineSnapshot(`
          [
            "BIID",
            {
              "product": undefined,
              "quantity": {
                "unit": undefined,
                "value": 3,
              },
            },
          ]
        `);
        expect(capture(basketItemsServiceMock.updateBasketItem).third()).toMatchInlineSnapshot(`
          [
            "BIID",
            {
              "product": undefined,
              "quantity": {
                "unit": undefined,
                "value": 4,
              },
            },
          ]
        `);
        done();
      });
    });

    it('should call the basketItemsService for deleteBasketItem if quantity = 0', done => {
      when(basketItemsServiceMock.deleteBasketItem(anyString())).thenReturn(of());

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
        verify(basketItemsServiceMock.deleteBasketItem(payload.lineItemUpdates[0].itemId)).once();
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
      const completion = updateBasketItemsSuccess({ info: undefined });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.updateBasketItems$).toBeObservable(expected$);
    });

    it('should map invalid request to action of type UpdateBasketItemsFail', () => {
      when(basketItemsServiceMock.updateBasketItem(anyString(), anything())).thenReturn(
        throwError(() => makeHttpError({ message: 'invalid' }))
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
      when(basketItemsServiceMock.deleteBasketItem(anyString())).thenReturn(of(undefined));

      store.dispatch(
        loadBasketSuccess({
          basket: {
            id: 'BID',
            lineItems: [],
          } as Basket,
        })
      );
    });

    it('should call the basketItemsService for DeleteBasketItem action', done => {
      const itemId = 'BIID';
      const action = deleteBasketItem({ itemId });
      actions$ = of(action);

      effects.deleteBasketItem$.subscribe(() => {
        verify(basketItemsServiceMock.deleteBasketItem('BIID')).once();
        done();
      });
    });

    it('should map to action of type DeleteBasketItemSuccess', () => {
      const itemId = 'BIID';
      const action = deleteBasketItem({ itemId });
      const completion = deleteBasketItemSuccess({ itemId, info: undefined });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.deleteBasketItem$).toBeObservable(expected$);
    });

    it('should map invalid request to action of type DeleteBasketItemFail', () => {
      when(basketItemsServiceMock.deleteBasketItem(anyString())).thenReturn(
        throwError(() => makeHttpError({ message: 'invalid' }))
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
      const action = deleteBasketItemSuccess({ itemId: '123', info: undefined });
      const completion = loadBasket();
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadBasketAfterBasketItemsChangeSuccess$).toBeObservable(expected$);
    });
  });

  describe('redirectToBasketIfBasketInteractionHasInfo$', () => {
    it('should navigate to basket if interaction has info', fakeAsync(() => {
      actions$ = of(deleteBasketItemSuccess({ itemId: '123', info: [{ message: 'INFO' } as BasketInfo] }));

      effects.redirectToBasketIfBasketInteractionHasInfo$.subscribe({ next: noop, error: fail, complete: noop });

      tick(500);

      expect(location.path()).toMatchInlineSnapshot(`"/basket?error=true"`);
    }));

    it('should not navigate to basket if interaction had no info', fakeAsync(() => {
      actions$ = of(deleteBasketItemSuccess({ itemId: '123', info: undefined }));

      effects.redirectToBasketIfBasketInteractionHasInfo$.subscribe({ next: noop, error: fail, complete: noop });

      tick(500);

      expect(location.path()).toMatchInlineSnapshot(`""`);
    }));
  });
});
