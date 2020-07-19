import { Product } from 'ish-core/models/product/product.model';
import { makeHttpError } from 'ish-core/utils/dev/api-service-utils';

import {
  loadProduct,
  loadProductBundlesSuccess,
  loadProductFail,
  loadProductIfNotLoaded,
  loadProductLinks,
  loadProductLinksFail,
  loadProductLinksSuccess,
  loadProductSuccess,
  loadProductVariations,
  loadProductVariationsFail,
  loadProductVariationsSuccess,
  loadProductsForCategory,
  loadProductsForCategoryFail,
  loadRetailSetSuccess,
} from './products.actions';
import { ProductsState, initialState, productsReducer } from './products.reducer';

describe('Products Reducer', () => {
  describe('undefined action', () => {
    it('should return the default state when previous state is undefined', () => {
      const action = {} as ReturnType<
        | typeof loadProduct
        | typeof loadProductBundlesSuccess
        | typeof loadProductFail
        | typeof loadProductIfNotLoaded
        | typeof loadProductSuccess
        | typeof loadProductsForCategory
        | typeof loadProductsForCategoryFail
        | typeof loadProductVariations
        | typeof loadProductVariationsFail
        | typeof loadProductVariationsSuccess
        | typeof loadRetailSetSuccess
        | typeof loadProductLinks
        | typeof loadProductLinksFail
        | typeof loadProductLinksSuccess
      >;
      const state = productsReducer(undefined, action);

      expect(state).toBe(initialState);
    });
  });

  describe('LoadProduct actions', () => {
    describe('LoadCategoryFail action', () => {
      let state: ProductsState;

      beforeEach(() => {
        const action = loadProductFail({ error: makeHttpError({}), sku: 'invalid' });
        state = productsReducer(initialState, action);
      });

      it('should add product to failed list', () => {
        expect(state.entities).toBeEmpty();
        expect(state.failed).toIncludeAllMembers(['invalid']);
      });

      describe('followed by LoadProductSuccess', () => {
        beforeEach(() => {
          const product = { sku: 'invalid' } as Product;
          const action = loadProductSuccess({ product });
          state = productsReducer(initialState, action);
        });

        it('should remove product on failed list', () => {
          expect(state.entities).toHaveProperty('invalid');
          expect(state.failed).toBeEmpty();
        });
      });
    });

    describe('LoadProductSuccess action', () => {
      let product: Product;

      beforeEach(() => {
        product = {
          sku: '111',
          name: 'Test product',
          inStock: true,
          completenessLevel: 2,
          longDescription: 'some description',
        } as Product;
      });

      it('should insert product if not exists', () => {
        const action = loadProductSuccess({ product });
        const state = productsReducer(initialState, action);

        expect(state.ids).toHaveLength(1);
        expect(state.entities[product.sku]).toEqual(product);
      });

      it('should merge product updates when new info is available', () => {
        const action1 = loadProductSuccess({ product });
        const state1 = productsReducer(initialState, action1);

        const updatedProduct = {
          sku: '111',
          completenessLevel: 1,
          manufacturer: 'Microsoft',
          name: 'Updated product',
          inStock: false,
        } as Product;

        const action2 = loadProductSuccess({ product: updatedProduct });
        const state2 = productsReducer(state1, action2);

        expect(state2.ids).toHaveLength(1);
        expect(state2.entities[product.sku]).toMatchInlineSnapshot(`
          Object {
            "completenessLevel": 2,
            "inStock": false,
            "longDescription": "some description",
            "manufacturer": "Microsoft",
            "name": "Updated product",
            "sku": "111",
          }
        `);
      });
    });
  });

  describe('LoadProductVariations actions', () => {
    describe('LoadProductVariationsSuccess action', () => {
      it('should set product variation data when reducing', () => {
        const product = { sku: 'SKU' } as Product;
        let state = productsReducer(initialState, loadProductSuccess({ product }));

        state = productsReducer(
          state,
          loadProductVariationsSuccess({
            sku: 'SKU',
            variations: ['VAR'],
            defaultVariation: 'VAR',
          })
        );

        expect(state.entities.SKU).toHaveProperty('variationSKUs', ['VAR']);
      });
    });

    describe('LoadProductVariationsFail action', () => {
      it('should put sku on failed list', () => {
        const error = makeHttpError({ message: 'invalid' });
        const action = loadProductVariationsFail({ error, sku: 'SKU' });
        const state = productsReducer(initialState, action);

        expect(state.failed).toContain('SKU');
      });
    });
  });
});
