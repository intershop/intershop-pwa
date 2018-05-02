import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { combineReducers, select, Store, StoreModule } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Basket } from '../../../models/basket/basket.model';
import { Product } from '../../../models/product/product.model';
import { LoadProductSuccess } from '../../../shopping/store/products';
import { shoppingReducers } from '../../../shopping/store/shopping.system';
import { c } from '../../../utils/dev/marbles-utils';
import { CheckoutState } from '../checkout.state';
import { checkoutReducers } from '../checkout.system';
import { LoadBasket, LoadBasketFail, LoadBasketItemsSuccess, LoadBasketSuccess } from './basket.actions';
import { getBasketError, getBasketLoading, getCurrentBasket } from './basket.selectors';

describe('Basket selectors', () => {
  let store$: Store<CheckoutState>;

  let basket$: Observable<Basket>;
  let basketLoading$: Observable<boolean>;
  let basketError$: Observable<HttpErrorResponse>;

  let basket;
  let lineItems;
  let prod: Product;

  beforeEach(() => {
    basket = {
      id: 'test',
      lineItems: [],
    };
    lineItems = [
      {
        id: 'test',
        product: {
          sku: 'test',
        },
      },
    ];
    prod = { sku: 'test' } as Product;

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
      store$.dispatch(new LoadProductSuccess(prod));
    });

    it('should set the state to loading', () => {
      expect(basketLoading$).toBeObservable(c(true));
    });

    it('should set loading to false and set basket state', () => {
      const expected = {
        id: 'test',
        lineItems: [
          {
            id: 'test',
            product: prod,
          },
        ],
      };

      store$.dispatch(new LoadBasketSuccess(basket));
      store$.dispatch(new LoadBasketItemsSuccess(lineItems));
      expect(basketLoading$).toBeObservable(c(false));
      expect(basket$).toBeObservable(c(expected));
    });

    it('should set loading to false and set error state', () => {
      store$.dispatch(new LoadBasketFail({ message: 'invalid' } as HttpErrorResponse));
      expect(basketLoading$).toBeObservable(c(false));
      expect(basket$).toBeObservable(c(null));
      expect(basketError$).toBeObservable(c({ message: 'invalid' }));
    });
  });
});
