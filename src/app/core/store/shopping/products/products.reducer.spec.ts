import { HttpError } from '../../../models/http-error/http-error.model';
import { Product } from '../../../models/product/product.model';

import * as fromActions from './products.actions';
import { ProductsState, initialState, productsReducer } from './products.reducer';

describe('Products Reducer', () => {
  describe('undefined action', () => {
    it('should return the default state when previous state is undefined', () => {
      const action = {} as fromActions.ProductsAction;
      const state = productsReducer(undefined, action);

      expect(state).toBe(initialState);
    });
  });

  describe('SelectProduct', () => {
    it('should select a product when reduced', () => {
      const action = new fromActions.SelectProduct({ sku: 'dummy' });
      const state = productsReducer(initialState, action);

      expect(state.selected).toEqual('dummy');
    });
  });

  describe('LoadProduct actions', () => {
    describe('LoadProduct action', () => {
      it('should set loading to true', () => {
        const action = new fromActions.LoadProduct({ sku: '123' });
        const state = productsReducer(initialState, action);

        expect(state.loading).toBeTrue();
        expect(state.entities).toBeEmpty();
      });
    });

    describe('LoadCategoryFail action', () => {
      let state: ProductsState;

      beforeEach(() => {
        const action = new fromActions.LoadProductFail({ error: {} as HttpError, sku: 'invalid' });
        state = productsReducer(initialState, action);
      });

      it('should set loading to false and add product to failed list', () => {
        expect(state.loading).toBeFalse();
        expect(state.entities).toBeEmpty();
        expect(state.failed).toIncludeAllMembers(['invalid']);
      });

      describe('followed by LoadProductSuccess', () => {
        beforeEach(() => {
          const product = { sku: 'invalid' } as Product;
          const action = new fromActions.LoadProductSuccess({ product });
          state = productsReducer(initialState, action);
        });

        it('should set loading to false and remove product from failed list', () => {
          expect(state.loading).toBeFalse();
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
        } as Product;
      });

      it('should insert product if not exists', () => {
        const action = new fromActions.LoadProductSuccess({ product });
        const state = productsReducer(initialState, action);

        expect(state.ids).toHaveLength(1);
        expect(state.entities[product.sku]).toEqual(product);
      });

      it('should update product if already exists', () => {
        const action1 = new fromActions.LoadProductSuccess({ product });
        const state1 = productsReducer(initialState, action1);

        const updatedProduct = { sku: '111' } as Product;
        updatedProduct.name = 'Updated product';
        updatedProduct.inStock = false;

        const action2 = new fromActions.LoadProductSuccess({ product: updatedProduct });
        const state2 = productsReducer(state1, action2);

        expect(state2.ids).toHaveLength(1);
        expect(state2.entities[product.sku]).toEqual(updatedProduct);
      });

      it('should set loading to false', () => {
        const action = new fromActions.LoadProductSuccess({ product });
        const state = productsReducer(initialState, action);

        expect(state.loading).toBeFalse();
      });
    });
  });
});
