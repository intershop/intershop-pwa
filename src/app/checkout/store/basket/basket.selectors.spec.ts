import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { routerReducer } from '@ngrx/router-store';
import { combineReducers, select, Store, StoreModule } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Basket } from '../../../models/basket/basket.model';
import { c } from '../../../utils/dev/marbles-utils';
import { CheckoutState } from '../checkout.state';
import { checkoutReducers } from '../checkout.system';
import { LoadBasket, LoadBasketFail, LoadBasketSuccess } from './basket.actions';
import { getBasketError, getBasketLoading, getCurrentBasket } from './basket.selectors';

describe('Basket selectors', () => {

  let store: Store<CheckoutState>;

  let basket$: Observable<Basket>;
  let basketLoading$: Observable<boolean>;
  let basketError$: Observable<HttpErrorResponse>;

  let basket;

  beforeEach(() => {
    basket = {
      id: 'test',
    } as Basket;

    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          checkout: combineReducers(checkoutReducers),
          routerReducer
        })
      ]
    });

    store = TestBed.get(Store);
    basket$ = store.pipe(select(getCurrentBasket));
    basketLoading$ = store.pipe(select(getBasketLoading));
    basketError$ = store.pipe(select(getBasketError));
  });

  describe('with empty state', () => {

    it('should be present if no basket is present', () => {
      expect(basket$).toBeObservable(c(null));
    });
  });

  describe('loading a basket', () => {

    beforeEach(() => {
      store.dispatch(new LoadBasket());
    });

    it('should set the state to loading', () => {
      expect(basketLoading$).toBeObservable(c(true));
    });

    it('should set the state to loading and report success', () => {
      store.dispatch(new LoadBasketSuccess(basket));
      expect(basketLoading$).toBeObservable(c(false));
      expect(basket$).toBeObservable(c(basket));
    });

    it('should set the state to loading and report failure', () => {
      store.dispatch(new LoadBasketFail({ message: 'invalid' } as HttpErrorResponse));
      expect(basketLoading$).toBeObservable(c(false));
      expect(basket$).toBeObservable(c(null));
      expect(basketError$).toBeObservable(c({ message: 'invalid' }));
    });
  });

});
