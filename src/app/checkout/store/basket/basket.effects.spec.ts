import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action, combineReducers, Store, StoreModule } from '@ngrx/store';
import { cold, hot } from 'jasmine-marbles';
import { Observable, of, throwError } from 'rxjs';
import { anyNumber, anyString, anything, instance, mock, verify, when } from 'ts-mockito';
import { LoginUserSuccess, LogoutUser } from '../../../core/store/user/user.actions';
import { BasketItem } from '../../../models/basket-item/basket-item.model';
import { Basket } from '../../../models/basket/basket.model';
import { Customer } from '../../../models/customer/customer.model';
import { PaymentMethod } from '../../../models/payment-method/payment-method.model';
import { Product } from '../../../models/product/product.model';
import { LoadProduct, LoadProductSuccess } from '../../../shopping/store/products';
import { ShoppingState } from '../../../shopping/store/shopping.state';
import { shoppingReducers } from '../../../shopping/store/shopping.system';
import { BasketService } from '../../services/basket/basket.service';
import { CheckoutState } from '../checkout.state';
import { checkoutReducers } from '../checkout.system';
import * as basketActions from './basket.actions';
import { BasketEffects } from './basket.effects';

describe('Basket Effects', () => {
  let actions$: Observable<Action>;
  let basketServiceMock: BasketService;
  let effects: BasketEffects;
  let store$: Store<CheckoutState | ShoppingState>;

  const basket = {
    id: 'test',
    lineItems: [],
    paymentMethod: null,
  } as Basket;

  const lineItems = [
    {
      id: 'test',
      name: 'test',
      position: 1,
      quantity: { type: 'test', value: 1 },
      productSKU: 'test',
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
        return throwError({ message: 'invalid' } as HttpErrorResponse);
      } else {
        return of({ id: id } as Basket);
      }
    });

    when(basketServiceMock.updateBasket(anyString(), anything())).thenCall(
      (basketId: string, payload: { invoiceToAddress: { id: string } }) => {
        if (basketId === 'invalid') {
          return throwError({ message: 'invalid' } as HttpErrorResponse);
        } else {
          return of({});
        }
      }
    );

    when(basketServiceMock.getBasket()).thenCall((id: string) => of({ id: 'test' } as Basket));

    when(basketServiceMock.getBasketItems(anyString())).thenCall((id: string) => {
      if (id === 'invalid') {
        return throwError({ message: 'invalid' } as HttpErrorResponse);
      } else {
        return of([]);
      }
    });

    when(basketServiceMock.addItemsToBasket(anything(), anyString())).thenCall(
      (items: { sku: string; quantity: number }[], basketId: string) => {
        if (items[0].sku === 'invalid') {
          return throwError({ message: 'invalid' } as HttpErrorResponse);
        } else {
          return of({});
        }
      }
    );

    when(basketServiceMock.updateBasketItem(anyString(), anyNumber(), anyString())).thenCall(
      (itemId: string, quantity: Number, basketId: string) => {
        if (itemId === 'invalid') {
          return throwError({ message: 'invalid' } as HttpErrorResponse);
        } else {
          return of({});
        }
      }
    );

    when(basketServiceMock.deleteBasketItem(anyString(), anyString())).thenCall((itemId: string, basketId: string) => {
      if (itemId === 'invalid') {
        return throwError({ message: 'invalid' } as HttpErrorResponse);
      } else {
        return of({});
      }
    });

    when(basketServiceMock.getBasketPayments(anyString())).thenCall((id: string) => {
      if (id === 'invalid') {
        return throwError({ message: 'invalid' } as HttpErrorResponse);
      } else {
        return of([]);
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
    it('should call the basketService for loadBasket', done => {
      const id = 'test';
      const action = new basketActions.LoadBasket(id);
      actions$ = of(action);

      effects.loadBasket$.subscribe(() => {
        verify(basketServiceMock.getBasket(id)).once();
        done();
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

  describe('updateBasket$', () => {
    it('should call the basketService for updateBasket', done => {
      store$.dispatch(new basketActions.LoadBasketSuccess(basket));

      const basketId = 'test';
      const payload = { invoiceToAddress: { id: '7654' } };
      const action = new basketActions.UpdateBasket(payload);
      actions$ = of(action);

      effects.updateBasket$.subscribe(() => {
        verify(basketServiceMock.updateBasket(basketId, payload)).once();
        done();
      });
    });
  });

  describe('loadBasketItems$', () => {
    beforeEach(() => {
      store$.dispatch(new basketActions.LoadBasketSuccess(basket));
    });

    it('should call the basketService for loadBasketItems', done => {
      const id = 'test';
      const action = new basketActions.LoadBasketItems(id);
      actions$ = of(action);

      effects.loadBasketItems$.subscribe(() => {
        verify(basketServiceMock.getBasketItems(id)).once();
        done();
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
    it('should call the basketService for addItemsToBasket', done => {
      store$.dispatch(new basketActions.LoadBasketSuccess(basket));

      const payload = { items: [{ sku: 'test', quantity: 1 }] };
      const action = new basketActions.AddItemsToBasket(payload);
      actions$ = of(action);

      effects.addItemsToBasket$.subscribe(() => {
        verify(basketServiceMock.addItemsToBasket(payload.items, 'test')).once();
        done();
      });
    });

    it('should call the basketService for addItemsToBasket with specific basketId when basketId set', done => {
      store$.dispatch(new basketActions.LoadBasketSuccess(basket));

      const payload = { items: [{ sku: 'test', quantity: 1 }], basketId: 'test2' };
      const action = new basketActions.AddItemsToBasket(payload);
      actions$ = of(action);

      effects.addItemsToBasket$.subscribe(() => {
        verify(basketServiceMock.addItemsToBasket(payload.items, 'test2')).once();
        done();
      });
    });

    it('should not call the basketService for addItemsToBasket if no basket in store', () => {
      const payload = { items: [{ sku: 'test', quantity: 1 }] };
      const action = new basketActions.AddItemsToBasket(payload);
      actions$ = of(action);

      effects.addItemsToBasket$.subscribe(fail, fail);

      verify(basketServiceMock.addItemsToBasket(anything(), 'test')).never();
    });

    it('should call the basketService for getBasket when no basket is present', done => {
      const payload = { items: [{ sku: 'test', quantity: 1 }] };
      const action = new basketActions.AddItemsToBasket(payload);
      actions$ = of(action);

      effects.getBasketBeforeAddItemsToBasket$.subscribe(() => {
        verify(basketServiceMock.getBasket()).once();
        done();
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
            sku: lineItems[0].productSKU,
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

    it('should call the basketService for updateBasketItem if quantity > 0', done => {
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
      actions$ = of(action);

      effects.updateBasketItems$.subscribe(() => {
        verify(basketServiceMock.updateBasketItem(payload[0].itemId, payload[0].quantity, 'test')).once();
        verify(basketServiceMock.updateBasketItem(payload[1].itemId, payload[1].quantity, 'test')).once();
        verify(basketServiceMock.updateBasketItem(payload[2].itemId, payload[2].quantity, 'test')).once();
        done();
      });
    });

    it('should call the basketService for deleteBasketItem if quantity = 0', done => {
      const payload = [
        {
          itemId: 'test',
          quantity: 0,
        },
      ];
      const action = new basketActions.UpdateBasketItems(payload);
      actions$ = of(action);

      effects.updateBasketItems$.subscribe(() => {
        verify(basketServiceMock.deleteBasketItem(payload[0].itemId, 'test')).once();
        done();
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

    it('should call the basketService for DeleteBasketItem action', done => {
      const payload = 'test';
      const action = new basketActions.DeleteBasketItem(payload);
      actions$ = of(action);

      effects.deleteBasketItem$.subscribe(() => {
        verify(basketServiceMock.deleteBasketItem('test', 'test')).once();
        done();
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

  describe('loadBasketPayments$', () => {
    beforeEach(() => {
      store$.dispatch(new basketActions.LoadBasketSuccess(basket));
    });

    it('should call the basketService for loadBasketPayments', done => {
      const id = 'test';
      const action = new basketActions.LoadBasketPayments(id);
      actions$ = of(action);

      effects.loadBasketPayments$.subscribe(() => {
        verify(basketServiceMock.getBasketPayments(id)).once();
        done();
      });
    });

    it('should map to action of type LoadBasketPaymentsSuccess', () => {
      const id = 'test';
      const action = new basketActions.LoadBasketPayments(id);
      const completion = new basketActions.LoadBasketPaymentsSuccess([] as PaymentMethod[]);
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadBasketPayments$).toBeObservable(expected$);
    });

    it('should map invalid request to action of type LoadBasketPaymentsFail', () => {
      const id = 'invalid';
      const action = new basketActions.LoadBasketPayments(id);
      const completion = new basketActions.LoadBasketPaymentsFail({ message: 'invalid' } as HttpErrorResponse);
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadBasketPayments$).toBeObservable(expected$);
    });

    it('should trigger LoadBasketPayments action if LoadBasketSuccess action triggered', () => {
      const action = new basketActions.LoadBasketSuccess({
        id: 'test',
      } as Basket);
      const completion = new basketActions.LoadBasketPayments('test');
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadBasketPaymentsAfterBasketLoad$).toBeObservable(expected$);
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
