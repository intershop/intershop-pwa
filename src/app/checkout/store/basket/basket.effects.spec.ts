import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action, combineReducers, Store, StoreModule } from '@ngrx/store';
import { cold, hot } from 'jasmine-marbles';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { _throw } from 'rxjs/observable/throw';
import { anyNumber, anyString, instance, mock, verify, when } from 'ts-mockito';
import { Attribute } from '../../../models/attribute/attribute.model';
import { BasketItem } from '../../../models/basket/basket-item.model';
import { Basket } from '../../../models/basket/basket.model';
import { LoadProduct } from '../../../shopping/store/products';
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

  const lineItems: BasketItem[] = [
    {
      id: 'test',
      name: 'test',
      position: 1,
      quantity: {
        type: 'test',
        value: 1,
      },
      product: {
        attributes: [] as Attribute[],
        title: 'test',
        type: 'test',
        uri: 'test',
      },
      price: null,
      singleBasePrice: null,
      isHiddenGift: false,
      isFreeGift: false,
      inStock: false,
      variationProduct: false,
      bundleProduct: false,
      availability: false,
    },
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

    when(basketServiceMock.getBasketItems(anyString())).thenCall((id: string) => {
      if (id === 'invalid') {
        return _throw({ message: 'invalid' } as HttpErrorResponse);
      } else {
        return of([]);
      }
    });

    when(basketServiceMock.addItemToBasket(anyString(), anyNumber(), anyString())).thenCall(
      (sku: string, quantity: number, basketId: string) => {
        if (sku === 'invalid') {
          return _throw({ message: 'invalid' } as HttpErrorResponse);
        } else {
          return of({});
        }
      }
    );

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
    it('should call the basketService for LoadBasket action', () => {
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
      actions$ = hot('-a', { a: action });
      const expected$ = cold('-c', { c: completion });

      expect(effects.loadBasket$).toBeObservable(expected$);
    });
  });

  describe('loadBasketItems$', () => {
    beforeEach(() => {
      store$.dispatch(new basketActions.LoadBasketSuccess(basket));
    });

    it('should call the basketService for LoadBasketItems action', () => {
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

    it('should trigger LoadBasketItems action if LoadBasketSuccess', () => {
      const action = new basketActions.LoadBasketSuccess({
        id: 'test',
      } as Basket);
      const completion = new basketActions.LoadBasketItems('test');
      actions$ = hot('-a', { a: action });
      const expected$ = cold('-c', { c: completion });

      expect(effects.loadBasketItemsAfterBasketLoad$).toBeObservable(expected$);
    });
  });

  describe('loadProductsForBasket$', () => {
    beforeEach(() => {
      store$.dispatch(new basketActions.LoadBasketSuccess(basket));
    });

    it('should call the productsSerivce for getProduct actions for line items if LoadBasketSuccess', () => {
      const action = new basketActions.LoadBasketItemsSuccess(lineItems);
      const completion = new LoadProduct('test');
      actions$ = hot('-a', { a: action });
      const expected$ = cold('-c', { c: completion });

      expect(effects.loadProductsForBasket$).toBeObservable(expected$);
    });
  });

  describe('addItemToBasket$', () => {
    beforeEach(() => {
      store$.dispatch(new basketActions.LoadBasketSuccess(basket));
    });

    it('should call the basketService for AddProductToBasket action', () => {
      const payload = { sku: 'test', quantity: 1 };
      const action = new basketActions.AddProductToBasket(payload);
      actions$ = hot('-a', { a: action });

      effects.addItemToBasket$.subscribe(() => {
        verify(basketServiceMock.addItemToBasket(payload.sku, payload.quantity, 'test')).once();
      });
    });

    it('should map to action of type AddItemToBasketSuccess', () => {
      const payload = { sku: 'test', quantity: 1 };
      const action = new basketActions.AddProductToBasket(payload);
      const completion = new basketActions.AddItemToBasketSuccess();
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.addItemToBasket$).toBeObservable(expected$);
    });

    it('should map invalid request to action of type AddItemToBasketFail', () => {
      const payload = { sku: 'invalid', quantity: 1 };
      const action = new basketActions.AddProductToBasket(payload);
      const completion = new basketActions.AddItemToBasketFail({ message: 'invalid' } as HttpErrorResponse);
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.addItemToBasket$).toBeObservable(expected$);
    });

    it('should trigger loadBasket if AddItemToBasketSuccess', () => {
      const action = new basketActions.AddItemToBasketSuccess();
      const completion = new basketActions.LoadBasket();
      actions$ = hot('-a', { a: action });
      const expected$ = cold('-c', { c: completion });

      expect(effects.loadBasketAfterAddItemToBasket$).toBeObservable(expected$);
    });
  });
});
