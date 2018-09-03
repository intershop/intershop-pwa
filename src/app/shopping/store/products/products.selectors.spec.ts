import { TestBed } from '@angular/core/testing';
import { combineReducers } from '@ngrx/store';

import { HttpError } from '../../../models/http-error/http-error.model';
import { Product } from '../../../models/product/product.model';
import { TestStore, ngrxTesting } from '../../../utils/dev/ngrx-testing';
import { shoppingReducers } from '../shopping.system';

import { LoadProduct, LoadProductFail, LoadProductSuccess, SelectProduct } from './products.actions';
import {
  getProductEntities,
  getProductLoading,
  getProducts,
  getSelectedProduct,
  getSelectedProductId,
} from './products.selectors';

describe('Products Selectors', () => {
  let store$: TestStore;

  let prod: Product;

  beforeEach(() => {
    prod = { sku: 'sku' } as Product;

    TestBed.configureTestingModule({
      imports: ngrxTesting({
        shopping: combineReducers(shoppingReducers),
      }),
    });

    store$ = TestBed.get(TestStore);
  });

  describe('with empty state', () => {
    it('should not select any products when used', () => {
      expect(getProducts(store$.state)).toBeEmpty();
      expect(getProductEntities(store$.state)).toBeEmpty();
      expect(getProductLoading(store$.state)).toBeFalse();
    });

    it('should not select a current product when used', () => {
      // TODO: shouldn't this be undefined?
      expect(getSelectedProduct(store$.state)).toBeUndefined();
      expect(getSelectedProductId(store$.state)).toBeUndefined();
    });
  });

  describe('loading a product', () => {
    beforeEach(() => {
      store$.dispatch(new LoadProduct(''));
    });

    it('should set the state to loading', () => {
      expect(getProductLoading(store$.state)).toBeTrue();
    });

    describe('and reporting success', () => {
      beforeEach(() => {
        store$.dispatch(new LoadProductSuccess(prod));
      });

      it('should set loading to false', () => {
        expect(getProductLoading(store$.state)).toBeFalse();
        expect(getProductEntities(store$.state)).toEqual({ [prod.sku]: prod });
      });
    });

    describe('and reporting failure', () => {
      beforeEach(() => {
        store$.dispatch(new LoadProductFail({ message: 'error' } as HttpError));
      });

      it('should not have loaded product on error', () => {
        expect(getProductLoading(store$.state)).toBeFalse();
        expect(getProductEntities(store$.state)).toBeEmpty();
      });
    });
  });

  describe('state with a product', () => {
    beforeEach(() => {
      store$.dispatch(new LoadProductSuccess(prod));
    });

    describe('but no current router state', () => {
      it('should return the product information when used', () => {
        expect(getProducts(store$.state)).toEqual([prod]);
        expect(getProductEntities(store$.state)).toEqual({ [prod.sku]: prod });
        expect(getProductLoading(store$.state)).toBeFalse();
      });

      it('should not select the irrelevant product when used', () => {
        expect(getSelectedProduct(store$.state)).toBeUndefined();
        expect(getSelectedProductId(store$.state)).toBeUndefined();
      });
    });

    describe('with product route', () => {
      beforeEach(() => {
        store$.dispatch(new SelectProduct(prod.sku));
      });

      it('should return the product information when used', () => {
        expect(getProducts(store$.state)).toEqual([prod]);
        expect(getProductEntities(store$.state)).toEqual({ [prod.sku]: prod });
        expect(getProductLoading(store$.state)).toBeFalse();
      });

      it('should select the selected product when used', () => {
        expect(getSelectedProduct(store$.state)).toEqual(prod);
        expect(getSelectedProductId(store$.state)).toEqual(prod.sku);
      });
    });
  });
});
