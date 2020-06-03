import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { Product } from 'ish-core/models/product/product.model';

import {
  LoadProductFail,
  LoadProductSuccess,
  LoadProductVariationsFail,
  LoadProductVariationsSuccess,
  ProductsAction,
} from './products.actions';
import { ProductsState, initialState, productsReducer } from './products.reducer';

describe('Products Reducer', () => {
  describe('undefined action', () => {
    it('should return the default state when previous state is undefined', () => {
      const action = {} as ProductsAction;
      const state = productsReducer(undefined, action);

      expect(state).toBe(initialState);
    });
  });

  describe('LoadProduct actions', () => {
    describe('LoadCategoryFail action', () => {
      let state: ProductsState;

      beforeEach(() => {
        const action = new LoadProductFail({ error: {} as HttpError, sku: 'invalid' });
        state = productsReducer(initialState, action);
      });

      it('should add product to failed list', () => {
        expect(state.entities).toBeEmpty();
        expect(state.failed).toIncludeAllMembers(['invalid']);
      });

      describe('followed by LoadProductSuccess', () => {
        beforeEach(() => {
          const product = { sku: 'invalid' } as Product;
          const action = new LoadProductSuccess({ product });
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
        const action = new LoadProductSuccess({ product });
        const state = productsReducer(initialState, action);

        expect(state.ids).toHaveLength(1);
        expect(state.entities[product.sku]).toEqual(product);
      });

      it('should merge product updates when new info is available', () => {
        const action1 = new LoadProductSuccess({ product });
        const state1 = productsReducer(initialState, action1);

        const updatedProduct = {
          sku: '111',
          completenessLevel: 1,
          manufacturer: 'Microsoft',
          name: 'Updated product',
          inStock: false,
        } as Product;

        const action2 = new LoadProductSuccess({ product: updatedProduct });
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
        let state = productsReducer(initialState, new LoadProductSuccess({ product }));

        state = productsReducer(
          state,
          new LoadProductVariationsSuccess({
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
        const error = { message: 'invalid' } as HttpError;
        const action = new LoadProductVariationsFail({ error, sku: 'SKU' });
        const state = productsReducer(initialState, action);

        expect(state.failed).toContain('SKU');
      });
    });
  });
});
