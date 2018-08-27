import { TestBed } from '@angular/core/testing';
import { combineReducers } from '@ngrx/store';

import { VariationProductMaster } from 'ish-core/models/product/product-variation-master.model';
import { VariationProduct } from 'ish-core/models/product/product-variation.model';
import { VariationLink } from 'ish-core/models/variation-link/variation-link.model';
import { TestStore, ngrxTesting } from 'ish-core/utils/dev/ngrx-testing';
import { HttpError } from '../../../models/http-error/http-error.model';
import { Product, ProductType } from '../../../models/product/product.model';
import { shoppingReducers } from '../shopping-store.module';

import {
  LoadProduct,
  LoadProductFail,
  LoadProductSuccess,
  LoadProductVariations,
  LoadProductVariationsFail,
  LoadProductVariationsSuccess,
  SelectProduct,
} from './products.actions';
import {
  getProduct,
  getProductEntities,
  getProductLoading,
  getProductVariations,
  getProducts,
  getSelectedMasterProduct,
  getSelectedProduct,
  getSelectedProductId,
  getSelectedProductVariations,
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
      expect(getProductVariations(store$.state)).toBeEmpty();
      expect(getProductLoading(store$.state)).toBeFalse();
    });

    it('should not select a current product when used', () => {
      expect(getSelectedProduct(store$.state)).toBeUndefined();
      expect(getSelectedProductId(store$.state)).toBeUndefined();
    });
  });

  describe('loading a product', () => {
    beforeEach(() => {
      store$.dispatch(new LoadProduct({ sku: '' }));
    });

    it('should set the state to loading', () => {
      expect(getProductLoading(store$.state)).toBeTrue();
    });

    describe('and reporting success', () => {
      beforeEach(() => {
        store$.dispatch(new LoadProductSuccess({ product: prod }));
      });

      it('should set loading to false', () => {
        expect(getProductLoading(store$.state)).toBeFalse();
        expect(getProductEntities(store$.state)).toEqual({ [prod.sku]: prod });
      });
    });

    describe('and reporting failure', () => {
      beforeEach(() => {
        store$.dispatch(new LoadProductFail({ error: { message: 'error' } as HttpError, sku: 'invalid' }));
      });

      it('should not have loaded product on error', () => {
        expect(getProductLoading(store$.state)).toBeFalse();
        expect(getProductEntities(store$.state)).toBeEmpty();
      });

      it('should return a product stub if product is selected', () => {
        expect(getProduct(store$.state, { sku: 'invalid' })).toBeTruthy();
      });
    });
  });

  describe('state with a product', () => {
    beforeEach(() => {
      store$.dispatch(new LoadProductSuccess({ product: prod }));
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
        store$.dispatch(new SelectProduct({ sku: prod.sku }));
      });

      it('should return the product information when used', () => {
        expect(getProducts(store$.state)).toEqual([prod]);
        expect(getProductEntities(store$.state)).toEqual({ [prod.sku]: prod });
        expect(getProductLoading(store$.state)).toBeFalse();
      });

      it('should select the selected product when used', () => {
        expect(getSelectedProduct(store$.state)).toHaveProperty('sku', prod.sku);
        expect(getSelectedProductId(store$.state)).toEqual(prod.sku);
      });
    });
  });

  describe('loading product variations', () => {
    beforeEach(() => {
      store$.dispatch(new LoadProductVariations({ sku: 'SKU' }));
    });

    it('should set the state to loading', () => {
      expect(getProductLoading(store$.state)).toBeTrue();
    });

    describe('and reporting success', () => {
      beforeEach(() => {
        store$.dispatch(new LoadProductVariationsSuccess({ sku: 'SKU', variations: [] }));
      });

      it('should set variations data and set loading to false', () => {
        const payload = { sku: 'SKU', variations: [] };
        expect(getProductLoading(store$.state)).toBeFalse();
        expect(getProductVariations(store$.state)).toEqual({ [payload.sku]: payload.variations });
      });
    });

    describe('and reporting failure', () => {
      beforeEach(() => {
        store$.dispatch(new LoadProductVariationsFail({ error: { message: 'error' } as HttpError }));
      });

      it('should not have loaded product variations on error', () => {
        expect(getProductLoading(store$.state)).toBeFalse();
        expect(getProductVariations(store$.state)).toBeEmpty();
      });
    });
  });

  describe('select product variations', () => {
    beforeEach(() => {
      store$.dispatch(
        new LoadProductSuccess({
          product: {
            sku: 'MSKU',
            type: ProductType.VariationProductMaster,
          } as VariationProductMaster,
        })
      );

      store$.dispatch(
        new LoadProductSuccess({
          product: {
            sku: 'SKU',
            productMasterSKU: 'MSKU',
            type: ProductType.VariationProduct,
          } as VariationProduct,
        })
      );

      store$.dispatch(
        new LoadProductVariationsSuccess({
          sku: 'MSKU',
          variations: [
            {
              title: 'VL',
            } as VariationLink,
          ],
        })
      );
    });

    it('should set selected variations of master product if master product is selected', () => {
      store$.dispatch(new SelectProduct({ sku: 'MSKU' }));

      expect(getSelectedProductVariations(store$.state)[0].title).toEqual('VL');
    });

    it('should set selected variations of master product if variation product is selected', () => {
      store$.dispatch(new SelectProduct({ sku: 'SKU' }));

      expect(getSelectedProductVariations(store$.state)[0].title).toEqual('VL');
    });

    it('should not selected variations for unknown product', () => {
      store$.dispatch(new SelectProduct({ sku: 'USKU' }));

      expect(getSelectedProductVariations(store$.state)).toBeEmpty();
    });
  });

  describe('select master product', () => {
    beforeEach(() => {
      store$.dispatch(
        new LoadProductSuccess({
          product: {
            sku: 'MSKU',
            type: ProductType.VariationProductMaster,
          } as VariationProductMaster,
        })
      );

      store$.dispatch(
        new LoadProductSuccess({
          product: {
            sku: 'SKU',
            productMasterSKU: 'MSKU',
            type: ProductType.VariationProduct,
          } as VariationProduct,
        })
      );
    });

    it('should set selected master product if variation product is selected', () => {
      store$.dispatch(new SelectProduct({ sku: 'SKU' }));

      expect(getSelectedMasterProduct(store$.state).sku).toEqual('MSKU');
    });

    it('should set selected master product if master product is selected', () => {
      store$.dispatch(new SelectProduct({ sku: 'MSKU' }));

      expect(getSelectedMasterProduct(store$.state).sku).toEqual('MSKU');
    });

    it('should not selected variations for unknown product', () => {
      store$.dispatch(new SelectProduct({ sku: 'USKU' }));

      expect(getSelectedMasterProduct(store$.state)).toBeUndefined();
    });
  });
});
