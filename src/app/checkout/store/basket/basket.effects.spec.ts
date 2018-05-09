import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action, combineReducers, Store, StoreModule } from '@ngrx/store';
import { cold, hot } from 'jasmine-marbles';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { _throw } from 'rxjs/observable/throw';
import { anyNumber, anyString, anything, instance, mock, verify, when } from 'ts-mockito';
import { LoginUserSuccess, LogoutUser } from '../../../core/store/user/user.actions';
import { BasketItem } from '../../../models/basket-item/basket-item.model';
import { Basket } from '../../../models/basket/basket.model';
import { Customer } from '../../../models/customer/customer.model';
import { Product } from '../../../models/product/product.model';
import { LoadProduct, LoadProductSuccess } from '../../../shopping/store/products';
import { ShoppingState } from '../../../shopping/store/shopping.state';
import { shoppingReducers } from '../../../shopping/store/shopping.system';
import { BasketService } from '../../services/basket/basket.service';
import { CheckoutState } from '../checkout.state';
import { checkoutReducers } from '../checkout.system';
import * as basketActions from './basket.actions';
import { BasketEffects } from './basket.effects';

describe('BasketEffects', () => {
  let actions$: Observable<Action>;
  let basketServiceMock: BasketService;
  let effects: BasketEffects;
  let store$: Store<CheckoutState | ShoppingState>;

  const basket = {
    id: 'test',
    lineItems: [],
  } as Basket;

  const lineItems = [
    {
      id: 'test',
      name: 'test',
      position: 1,
      quantity: { type: 'test', value: 1 },
      product: { sku: 'test' } as Product,
      price: null,
      singleBasePrice: null,
      isHiddenGift: false,
      isFreeGift: false,
      inStock: false,
      variationProduct: false,
      bundleProduct: false,
      availability: false,
    } as BasketItem,
  ];

  beforeEach(() => {
    basketServiceMock = mock(BasketService);

    when(basketServiceMock.getBasket(anyString())).thenCall((id: string) => {
      if (id === 'invalid') {
        return _throw({ message: 'invalid' } as HttpErrorResponse);
      } else {
        return of({ id: id } as Basket);
      }
    });

    when(basketServiceMock.getBasket()).thenCall((id: string) => {
      return of({ id: 'test' } as Basket);
    });

    when(basketServiceMock.getBasketItems(anyString())).thenCall((id: string) => {
      if (id === 'invalid') {
        return _throw({ message: 'invalid' } as HttpErrorResponse);
      } else {
        return of([]);
      }
    });

    when(basketServiceMock.addItemsToBasket(anything(), anyString())).thenCall(
      (items: { sku: string; quantity: number }[], basketId: string) => {
        if (items[0].sku === 'invalid') {
          return _throw({ message: 'invalid' } as HttpErrorResponse);
        } else {
          return of({});
        }
      }
    );

    when(basketServiceMock.updateBasketItem(anyString(), anyNumber(), anyString())).thenCall(
      (itemId: string, quantity: Number, basketId: string) => {
        if (itemId === 'invalid') {
          return _throw({ message: 'invalid' } as HttpErrorResponse);
        } else {
          return of({});
        }
      }
    );

    when(basketServiceMock.deleteBasketItem(anyString(), anyString())).thenCall((itemId: string, basketId: string) => {
      if (itemId === 'invalid') {
        return _throw({ message: 'invalid' } as HttpErrorResponse);
      } else {
        return of({});
      }
    });

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
      ],
    });

    effects = TestBed.get(BasketEffects);
    store$ = TestBed.get(Store);
  });

  describe('loadBasket$', () => {
    it('should call the basketService for loadBasket', () => {
      const id = 'test';
      const action = new basketActions.LoadBasket(id);
      actions$ = hot('-a', { a: action });

      effects.loadBasket$.subscribe(() => {
        verify(basketServiceMock.getBasket(id)).once();
      });
    });

    it('should map to action of type LoadBasketSuccess', () => {
      const id = 'test';
      const action = new basketActions.LoadBasket(id);
      const completion = new basketActions.LoadBasketSuccess({ id: id } as Basket);
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadBasket$).toBeObservable(expected$);
    });

    it('should map invalid request to action of type LoadBasketFail', () => {
      const id = 'invalid';
      const action = new basketActions.LoadBasket(id);
      const completion = new basketActions.LoadBasketFail({ message: 'invalid' } as HttpErrorResponse);
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadBasket$).toBeObservable(expected$);
    });
  });

  describe('loadBasketItems$', () => {
    beforeEach(() => {
      store$.dispatch(new basketActions.LoadBasketSuccess(basket));
    });

    it('should call the basketService for loadBasketItems', () => {
      const id = 'test';
      const action = new basketActions.LoadBasketItems(id);
      actions$ = hot('-a', { a: action });

      effects.loadBasketItems$.subscribe(() => {
        verify(basketServiceMock.getBasketItems(id)).once();
      });
    });

    it('should map to action of type LoadBasketItemsSuccess', () => {
      const id = 'test';
      const action = new basketActions.LoadBasketItems(id);
      const completion = new basketActions.LoadBasketItemsSuccess([] as BasketItem[]);
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadBasketItems$).toBeObservable(expected$);
    });

    it('should map invalid request to action of type LoadBasketItemsFail', () => {
      const id = 'invalid';
      const action = new basketActions.LoadBasketItems(id);
      const completion = new basketActions.LoadBasketItemsFail({ message: 'invalid' } as HttpErrorResponse);
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadBasketItems$).toBeObservable(expected$);
    });

    it('should trigger LoadBasketItems action if LoadBasketSuccess action triggered', () => {
      const action = new basketActions.LoadBasketSuccess({
        id: 'test',
      } as Basket);
      const completion = new basketActions.LoadBasketItems('test');
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadBasketItemsAfterBasketLoad$).toBeObservable(expected$);
    });
  });

  describe('loadProductsForBasket$', () => {
    beforeEach(() => {
      store$.dispatch(new basketActions.LoadBasketSuccess(basket));
    });

    it('should trigger LoadProduct actions for line items if LoadBasketSuccess action triggered', () => {
      const action = new basketActions.LoadBasketItemsSuccess(lineItems);
      const completion = new LoadProduct('test');
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadProductsForBasket$).toBeObservable(expected$);
    });
  });

  describe('addItemsToBasket$', () => {
    it('should call the basketService for addItemsToBasket', () => {
      store$.dispatch(new basketActions.LoadBasketSuccess(basket));

      const payload = { items: [{ sku: 'test', quantity: 1 }] };
      const action = new basketActions.AddItemsToBasket(payload);
      actions$ = hot('-a', { a: action });

      effects.addItemsToBasket$.subscribe(() => {
        verify(basketServiceMock.addItemsToBasket(payload.items, 'test')).once();
      });
    });

    it('should call the basketService for addItemsToBasket with specific basketId when basketId set', () => {
      store$.dispatch(new basketActions.LoadBasketSuccess(basket));

      const payload = { items: [{ sku: 'test', quantity: 1 }], basketId: 'test2' };
      const action = new basketActions.AddItemsToBasket(payload);
      actions$ = hot('-a', { a: action });

      effects.addProductToBasket$.subscribe(() => {
        verify(basketServiceMock.addItemsToBasket(payload.items, 'test2')).once();
      });
    });

    it('should not call the basketService for addItemsToBasket if no basket in store', () => {
      const payload = { items: [{ sku: 'test', quantity: 1 }] };
      const action = new basketActions.AddItemsToBasket(payload);
      actions$ = hot('-a', { a: action });

      effects.addProductToBasket$.subscribe(() => {
        verify(basketServiceMock.addItemsToBasket(anything(), 'test')).never();
      });
    });

    it('should call the basketService for getBasket when no basket is present', () => {
      const payload = { items: [{ sku: 'test', quantity: 1 }] };
      const action = new basketActions.AddItemsToBasket(payload);
      actions$ = hot('-a', { a: action });

      effects.addProductToBasket$.subscribe(() => {
        verify(basketServiceMock.getBasket()).once();
      });
    });

    it('should map to action of type AddItemsToBasketSuccess', () => {
      store$.dispatch(new basketActions.LoadBasketSuccess(basket));

      const payload = { items: [{ sku: 'test', quantity: 1 }] };
      const action = new basketActions.AddItemsToBasket(payload);
      const completion = new basketActions.AddItemsToBasketSuccess();
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.addItemsToBasket$).toBeObservable(expected$);
    });

    it('should map invalid request to action of type AddItemsToBasketFail', () => {
      store$.dispatch(new basketActions.LoadBasketSuccess(basket));

      const payload = { items: [{ sku: 'invalid', quantity: 1 }] };
      const action = new basketActions.AddItemsToBasket(payload);
      const completion = new basketActions.AddItemsToBasketFail({ message: 'invalid' } as HttpErrorResponse);
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.addItemsToBasket$).toBeObservable(expected$);
    });
  });

  describe('addProductToBasket$', () => {
    it('should map an AddProductToBasket to an AddItemsToBasket action', () => {
      const payload = { sku: 'test', quantity: 1 };
      const action = new basketActions.AddProductToBasket(payload);
      const completion = new basketActions.AddItemsToBasket({ items: [payload] });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.addProductToBasket$).toBeObservable(expected$);
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
      store$.dispatch(new basketActions.LoadBasketSuccess(basket));
      store$.dispatch(new basketActions.LoadBasketItemsSuccess(lineItems));
      store$.dispatch(new LoadProductSuccess({ sku: 'test' } as Product));

      const action = new LoginUserSuccess({} as Customer);
      const completion = new basketActions.AddItemsToBasket({
        items: [
          {
            sku: lineItems[0].product.sku,
            quantity: lineItems[0].quantity.value,
          },
        ],
        basketId: basket.id,
      });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.mergeBasketAfterLogin$).toBeObservable(expected$);
    });
  });

  describe('loadBasketAfterLogin$', () => {
    it('should map to action of type LoadBasket if pre login basket is empty', () => {
      const action = new LoginUserSuccess({} as Customer);
      const completion = new basketActions.LoadBasket();
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadBasketAfterLogin$).toBeObservable(expected$);
    });
  });

  describe('updateBasketItems$', () => {
    beforeEach(() => {
      store$.dispatch(new basketActions.LoadBasketSuccess(basket));
      store$.dispatch(new basketActions.LoadBasketItemsSuccess(lineItems));
    });

    it('should call the basketService for updateBasketItem if quantity > 0', () => {
      const payload = [
        {
          itemId: 'test',
          quantity: 2,
        },
        {
          itemId: 'test',
          quantity: 3,
        },
        {
          itemId: 'test',
          quantity: 4,
        },
      ];
      const action = new basketActions.UpdateBasketItems(payload);
      actions$ = hot('-a', { a: action });

      effects.updateBasketItems$.subscribe(() => {
        verify(basketServiceMock.updateBasketItem(payload[0].itemId, payload[0].quantity, 'test')).once();
        verify(basketServiceMock.updateBasketItem(payload[1].itemId, payload[1].quantity, 'test')).once();
        verify(basketServiceMock.updateBasketItem(payload[2].itemId, payload[2].quantity, 'test')).once();
      });
    });

    it('should call the basketService for deleteBasketItem if quantity = 0', () => {
      const payload = [
        {
          itemId: 'test',
          quantity: 0,
        },
      ];
      const action = new basketActions.UpdateBasketItems(payload);
      actions$ = hot('-a', { a: action });

      effects.updateBasketItems$.subscribe(() => {
        verify(basketServiceMock.deleteBasketItem(payload[0].itemId, 'test')).once();
      });
    });

    it('should map to action of type UpdateBasketItemsSuccess', () => {
      const payload = [
        {
          itemId: 'test',
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
      store$.dispatch(
        new basketActions.LoadBasketItemsSuccess([
          {
            ...lineItems[0],
            id: 'invalid',
          },
        ])
      );

      const payload = [
        {
          itemId: 'invalid',
          quantity: -1,
        },
      ];
      const action = new basketActions.UpdateBasketItems(payload);
      const completion = new basketActions.UpdateBasketItemsFail({ message: 'invalid' } as HttpErrorResponse);
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
      store$.dispatch(new basketActions.LoadBasketSuccess(basket));
    });

    it('should call the basketService for DeleteBasketItem action', () => {
      const payload = 'test';
      const action = new basketActions.DeleteBasketItem(payload);
      actions$ = hot('-a', { a: action });

      effects.deleteBasketItem$.subscribe(() => {
        verify(basketServiceMock.deleteBasketItem('test', 'test')).once();
      });
    });

    it('should map to action of type DeleteBasketItemSuccess', () => {
      const payload = 'test';
      const action = new basketActions.DeleteBasketItem(payload);
      const completion = new basketActions.DeleteBasketItemSuccess();
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.deleteBasketItem$).toBeObservable(expected$);
    });

    it('should map invalid request to action of type DeleteBasketItemFail', () => {
      const payload = 'invalid';
      const action = new basketActions.DeleteBasketItem(payload);
      const completion = new basketActions.DeleteBasketItemFail({ message: 'invalid' } as HttpErrorResponse);
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

  describe('resetBasketAfterLogout$', () => {
    it('should map to action of type ResetBasket if LogoutUser action triggered', () => {
      const action = new LogoutUser();
      const completion = new basketActions.ResetBasket();
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.resetBasketAfterLogout$).toBeObservable(expected$);
    });
  });
});
