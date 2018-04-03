import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { routerReducer } from '@ngrx/router-store';
import { combineReducers, select, Store, StoreModule } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Product } from '../../../models/product/product.model';
import { c } from '../../../utils/dev/marbles-utils';
import { navigateMockAction } from '../../../utils/dev/navigate-mock.action';
import { ShoppingState } from '../shopping.state';
import { shoppingReducers } from '../shopping.system';
import { LoadProduct, LoadProductFail, LoadProductSuccess } from './products.actions';
import * as s from './products.selectors';

describe('Products Selectors', () => {

  let store: Store<ShoppingState>;

  let products$: Observable<Product[]>;
  let productEntities$: Observable<{ [id: string]: Product }>;
  let productLoading$: Observable<boolean>;
  let selected$: Observable<Product>;
  let selectedId$: Observable<string>;

  let prod: Product;

  beforeEach(() => {
    prod = { sku: 'sku' } as Product;

    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          shopping: combineReducers(shoppingReducers),
          routerReducer
        })
      ]
    });

    store = TestBed.get(Store);

    products$ = store.pipe(select(s.getProducts));
    productEntities$ = store.pipe(select(s.getProductEntities));
    productLoading$ = store.pipe(select(s.getProductLoading));
    selected$ = store.pipe(select(s.getSelectedProduct));
    selectedId$ = store.pipe(select(s.getSelectedProductId));
  });

  describe('with empty state', () => {

    it('should not select any products when used', () => {
      expect(products$).toBeObservable(c([]));
      expect(productEntities$).toBeObservable(c({}));
      expect(productLoading$).toBeObservable(c(false));
    });

    it('should not select a current product when used', () => {
      // TODO: shouldn't this be null?
      expect(selected$).toBeObservable(c(undefined));
      expect(selectedId$).toBeObservable(c(undefined));
    });
  });

  describe('loading a product', () => {

    beforeEach(() => {
      store.dispatch(new LoadProduct(''));
    });

    it('should set the state to loading', () => {
      expect(productLoading$).toBeObservable(c(true));
    });

    describe('and reporting success', () => {

      beforeEach(() => {
        store.dispatch(new LoadProductSuccess(prod));
      });

      it('should set loading to false', () => {
        expect(productLoading$).toBeObservable(c(false));
        expect(productEntities$).toBeObservable(c({ [prod.sku]: prod }));
      });
    });

    describe('and reporting failure', () => {

      beforeEach(() => {
        store.dispatch(new LoadProductFail({ message: 'error' } as HttpErrorResponse));
      });

      it('should not have loaded product on error', () => {
        expect(productLoading$).toBeObservable(c(false));
        expect(productEntities$).toBeObservable(c({}));
      });
    });
  });

  describe('state with a product', () => {

    beforeEach(() => {
      store.dispatch(new LoadProductSuccess(prod));
    });

    describe('but no current router state', () => {

      it('should return the product information when used', () => {
        expect(products$).toBeObservable(c([prod]));
        expect(productEntities$).toBeObservable(c({ [prod.sku]: prod }));
        expect(productLoading$).toBeObservable(c(false));
      });

      it('should not select the irrelevant product when used', () => {
        expect(selected$).toBeObservable(c(undefined));
        expect(selectedId$).toBeObservable(c(undefined));
      });
    });

    describe('with product route', () => {

      beforeEach(() => {
        store.dispatch(navigateMockAction({ url: '/any', params: { sku: prod.sku } }));
      });

      it('should return the product information when used', () => {
        expect(products$).toBeObservable(c([prod]));
        expect(productEntities$).toBeObservable(c({ [prod.sku]: prod }));
        expect(productLoading$).toBeObservable(c(false));
      });

      it('should select the selected product when used', () => {
        expect(selected$).toBeObservable(c(prod));
        expect(selectedId$).toBeObservable(c(prod.sku));
      });
    });
  });
});
