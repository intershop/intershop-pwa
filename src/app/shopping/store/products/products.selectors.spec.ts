import { TestBed } from '@angular/core/testing';
import { Dictionary } from '@ngrx/entity/src/models';
import { routerReducer } from '@ngrx/router-store';
import { combineReducers, select, Store, StoreModule } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { LoadProduct, LoadProductFail, LoadProductSuccess } from '.';
import { c } from '../../../dev-utils/marbles-utils';
import { navigateMockAction } from '../../../dev-utils/navigate-mock.action';
import { Product } from '../../../models/product/product.model';
import { ShoppingState } from '../shopping.state';
import { reducers } from '../shopping.system';
import * as s from './products.selectors';

describe('Products Selectors', () => {

  let store: Store<ShoppingState>;

  let products$: Observable<Product[]>;
  let productEntities$: Observable<Dictionary<Product>>;
  let productLoading$: Observable<boolean>;
  let selected$: Observable<Product>;
  let selectedId$: Observable<string>;

  let prod: Product;

  beforeEach(() => {
    prod = new Product('sku');

    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          shopping: combineReducers(reducers),
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
        store.dispatch(new LoadProductFail({ message: 'error' }));
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
