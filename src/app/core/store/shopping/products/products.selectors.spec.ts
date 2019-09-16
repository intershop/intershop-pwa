import { TestBed } from '@angular/core/testing';
import { combineReducers } from '@ngrx/store';

import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { Product } from 'ish-core/models/product/product.model';
import { shoppingReducers } from 'ish-core/store/shopping/shopping-store.module';
import { TestStore, ngrxTesting } from 'ish-core/utils/dev/ngrx-testing';

import {
  LoadProduct,
  LoadProductBundlesSuccess,
  LoadProductFail,
  LoadProductLinksSuccess,
  LoadProductSuccess,
  LoadProductVariations,
  LoadProductVariationsFail,
  LoadProductVariationsSuccess,
  LoadRetailSetSuccess,
  SelectProduct,
} from './products.actions';
import {
  getProduct,
  getProductEntities,
  getProductLinks,
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
        reducers: {
          shopping: combineReducers(shoppingReducers),
        },
      }),
    });

    store$ = TestBed.get(TestStore);
  });

  describe('with empty state', () => {
    it('should not select any products when used', () => {
      expect(getProductEntities(store$.state)).toBeEmpty();
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
        expect(getProductEntities(store$.state)).toEqual({ [prod.sku]: prod });
        expect(getProductLoading(store$.state)).toBeFalse();
      });

      it('should select the selected product when used', () => {
        expect(getSelectedProduct(store$.state)).toHaveProperty('sku', prod.sku);
        expect(getSelectedProductId(store$.state)).toEqual(prod.sku);
      });
    });
  });

  describe('when loading bundles', () => {
    it('should contain the product bundle information on the product', () => {
      store$.dispatch(new LoadProductSuccess({ product: { sku: 'ABC' } as Product }));
      store$.dispatch(
        new LoadProductBundlesSuccess({
          sku: 'ABC',
          bundledProducts: [{ sku: 'A', quantity: 1 }, { sku: 'B', quantity: 2 }],
        })
      );

      expect(getProductEntities(store$.state).ABC).toMatchInlineSnapshot(`
        Object {
          "bundledProducts": Array [
            Object {
              "quantity": 1,
              "sku": "A",
            },
            Object {
              "quantity": 2,
              "sku": "B",
            },
          ],
          "sku": "ABC",
        }
      `);
    });
  });

  describe('when loading retail sets', () => {
    it('should contain the product retail set information on the product', () => {
      store$.dispatch(new LoadProductSuccess({ product: { sku: 'ABC' } as Product }));
      store$.dispatch(
        new LoadRetailSetSuccess({
          sku: 'ABC',
          parts: ['A', 'B'],
        })
      );

      expect(getProductEntities(store$.state).ABC).toMatchInlineSnapshot(`
        Object {
          "partSKUs": Array [
            "A",
            "B",
          ],
          "sku": "ABC",
        }
      `);
    });
  });

  describe('loading product variations', () => {
    beforeEach(() => {
      store$.dispatch(new LoadProductSuccess({ product: { sku: 'SKU', type: 'VariationProductMaster' } as Product }));
      store$.dispatch(new LoadProductVariations({ sku: 'SKU' }));
    });

    it('should set the state to loading', () => {
      expect(getProductLoading(store$.state)).toBeTrue();
    });

    describe('and reporting success', () => {
      beforeEach(() => {
        store$.dispatch(new LoadProductVariationsSuccess({ sku: 'SKU', variations: ['VAR'], defaultVariation: 'VAR' }));
      });

      it('should set variations data and set loading to false', () => {
        expect(getProductLoading(store$.state)).toBeFalse();
        expect(getProductEntities(store$.state).SKU).toMatchInlineSnapshot(`
          Object {
            "defaultVariationSKU": "VAR",
            "sku": "SKU",
            "type": "VariationProductMaster",
            "variationSKUs": Array [
              "VAR",
            ],
          }
        `);
      });
    });

    describe('and reporting failure', () => {
      beforeEach(() => {
        store$.dispatch(new LoadProductVariationsFail({ error: { message: 'error' } as HttpError, sku: 'SKU' }));
      });

      it('should not have loaded product variations on error', () => {
        expect(getProductLoading(store$.state)).toBeFalse();
        expect(getProductEntities(store$.state).SKU).toEqual({ sku: 'SKU', type: 'VariationProductMaster' });
      });
    });
  });

  describe('state with multiple products', () => {
    beforeEach(() => {
      store$.dispatch(new LoadProductSuccess({ product: { sku: 'SKU1', name: 'sku1' } as Product }));
      store$.dispatch(new LoadProductSuccess({ product: { sku: 'SKU2', name: 'sku2' } as Product }));
      store$.dispatch(new LoadProductSuccess({ product: { sku: 'SKU3', name: 'sku3' } as Product }));
    });

    it('should select various products on entites selector', () => {
      expect(getProductEntities(store$.state)).toHaveProperty('SKU1');
      expect(getProductEntities(store$.state)).toHaveProperty('SKU2');
      expect(getProductEntities(store$.state)).toHaveProperty('SKU3');
    });

    it('should select various products on single product selector', () => {
      expect(getProduct(store$.state, { sku: 'SKU1' })).toHaveProperty('name', 'sku1');
      expect(getProduct(store$.state, { sku: 'SKU2' })).toHaveProperty('name', 'sku2');
      expect(getProduct(store$.state, { sku: 'SKU3' })).toHaveProperty('name', 'sku3');
    });

    it('should select various products on multiple products selector', () => {
      const products = getProducts(store$.state, { skus: ['SKU1', 'SKU2', 'SKU3'] });
      expect(products).toHaveLength(3);
      expect(products.map(p => p.name)).toEqual(['sku1', 'sku2', 'sku3']);
    });
  });

  describe('when loading product links', () => {
    it('should contain the product link information on the product', () => {
      store$.dispatch(new LoadProductSuccess({ product: { sku: 'ABC' } as Product }));
      store$.dispatch(
        new LoadProductLinksSuccess({
          sku: 'ABC',
          links: { linkType: { products: ['prod'], categories: ['cat'] } },
        })
      );

      expect(getProductLinks(store$.state, { sku: 'ABC' })).toMatchInlineSnapshot(`
        Object {
          "linkType": Object {
            "categories": [Function],
            "categoryIds": Array [
              "cat",
            ],
            "productSKUs": Array [
              "prod",
            ],
            "products": [Function],
          },
        }
      `);
    });
  });
});
