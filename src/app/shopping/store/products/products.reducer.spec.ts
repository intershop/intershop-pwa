import { Product } from '../../../models/product/product.model';
import * as fromActions from './products.actions';
import { initialState, productsReducer } from './products.reducer';

describe('Products Reducer', () => {
  describe('undefined action', () => {
    it('should return the default state when previous state is undefined', () => {
      const action = {} as any;
      const state = productsReducer(undefined, action);

      expect(state).toBe(initialState);
    });
  });

  describe('LoadProduct actions', () => {
    describe('LoadProduct action', () => {
      it('should set loading to true', () => {
        const action = new fromActions.LoadProduct('123');
        const state = productsReducer(initialState, action);

        expect(state.loading).toEqual(true);
        expect(state.entities).toEqual({});
      });
    });

    describe('LoadCategoryFail action', () => {
      it('should set loading to false', () => {
        const action = new fromActions.LoadProductFail({});
        const state = productsReducer(initialState, action);

        expect(state.loading).toEqual(false);
        expect(state.entities).toEqual({});
      });
    });

    describe('LoadProductSuccess action', () => {
      let product: Product;

      beforeEach(() => {
        product = {
          sku: '111',
          name: 'Test product',
          inStock: true
        } as Product;
      });

      it('should insert product if not exists', () => {
        const action = new fromActions.LoadProductSuccess(product);
        const state = productsReducer(initialState, action);

        expect(state.ids.length).toBe(1);
        expect(state.entities[product.sku]).toEqual(product);
      });

      it('should update product if already exists', () => {
        const action1 = new fromActions.LoadProductSuccess(product);
        const state1 = productsReducer(initialState, action1);

        const updatedProduct = {
          ...product,
          name: 'Updated product',
          inStock: false
        } as Product;

        const action2 = new fromActions.LoadProductSuccess(updatedProduct);
        const state2 = productsReducer(state1, action2);

        expect(state2.ids.length).toBe(1);
        expect(state2.entities[product.sku]).toEqual(updatedProduct);
      });

      it('should set loading to false', () => {
        const action = new fromActions.LoadProductSuccess(product);
        const state = productsReducer(initialState, action);

        expect(state.loading).toEqual(false);
      });
    });

  });
});
