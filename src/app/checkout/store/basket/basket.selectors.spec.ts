import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { combineReducers, select, Store, StoreModule } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BasketItem } from '../../../models/basket-item/basket-item.model';
import { Basket, BasketView } from '../../../models/basket/basket.model';
import { Product } from '../../../models/product/product.model';
import { LoadProductSuccess } from '../../../shopping/store/products';
import { shoppingReducers } from '../../../shopping/store/shopping.system';
import { c } from '../../../utils/dev/marbles-utils';
import { CheckoutState } from '../checkout.state';
import { checkoutReducers } from '../checkout.system';
import { LoadBasket, LoadBasketFail, LoadBasketItemsSuccess, LoadBasketSuccess } from './basket.actions';
import { getBasketError, getBasketLoading, getCurrentBasket } from './basket.selectors';

describe('Basket Selectors', () => {
  let store$: Store<CheckoutState>;

  let basket$: Observable<BasketView>;
  let basketLoading$: Observable<boolean>;
  let basketError$: Observable<HttpErrorResponse>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          checkout: combineReducers(checkoutReducers),
          shopping: combineReducers(shoppingReducers),
        }),
      ],
    });

    store$ = TestBed.get(Store);
    basket$ = store$.pipe(select(getCurrentBasket));
    basketLoading$ = store$.pipe(select(getBasketLoading));
    basketError$ = store$.pipe(select(getBasketError));
    basketError$ = store$.pipe(select(getBasketError));
  });

  describe('with empty state', () => {
    it('should be present if no basket is present', () => {
      expect(basket$).toBeObservable(c(null));
    });
  });

  describe('loading a basket', () => {
    beforeEach(() => {
      store$.dispatch(new LoadBasket());
      store$.dispatch(new LoadProductSuccess({ sku: 'sku' } as Product));
    });

    it('should set the state to loading', () => {
      expect(basketLoading$).toBeObservable(c(true));
    });

    it('should set loading to false and set basket state', () => {
      store$.dispatch(new LoadBasketSuccess({ id: 'test' } as Basket));
      store$.dispatch(new LoadBasketItemsSuccess([{ id: 'test', productSKU: 'sku' } as BasketItem]));
      expect(basketLoading$).toBeObservable(c(false));
      expect(basket$.pipe(map(b => b.id))).toBeObservable(c('test'));
      expect(basket$.pipe(map(b => b.lineItems.length))).toBeObservable(c(1));
      expect(basket$.pipe(map(b => b.lineItems[0].id))).toBeObservable(c('test'));
      expect(basket$.pipe(map(b => b.lineItems[0].product))).toBeObservable(c({ sku: 'sku' }));
    });

    it('should change the product of the basket line item if the product is changing', () => {
      store$.dispatch(new LoadBasketSuccess({ id: 'test' } as Basket));
      store$.dispatch(new LoadBasketItemsSuccess([{ id: 'test', productSKU: 'sku' } as BasketItem]));

      expect(basket$.pipe(map(b => b.lineItems[0].product))).toBeObservable(c({ sku: 'sku' }));

      store$.dispatch(new LoadProductSuccess({ sku: 'sku', name: 'new name' } as Product));

      expect(basket$.pipe(map(b => b.lineItems[0].product))).toBeObservable(c({ sku: 'sku', name: 'new name' }));
    });

    it('should set loading to false and set error state', () => {
      store$.dispatch(new LoadBasketFail({ message: 'invalid' } as HttpErrorResponse));
      expect(basketLoading$).toBeObservable(c(false));
      expect(basket$).toBeObservable(c(null));
      expect(basketError$).toBeObservable(c({ message: 'invalid' }));
    });
  });
});
