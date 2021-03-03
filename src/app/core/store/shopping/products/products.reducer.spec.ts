import { Product } from 'ish-core/models/product/product.model';

import { loadProductSuccess } from './products.actions';
import { initialState, productsReducer } from './products.reducer';

describe('Products Reducer', () => {
  describe('LoadProductSuccess action', () => {
    let product: Product;

    beforeEach(() => {
      product = {
        sku: '111',
        name: 'Test product',
        available: true,
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
        available: false,
      } as Product;

      const action2 = loadProductSuccess({ product: updatedProduct });
      const state2 = productsReducer(state1, action2);

      expect(state2.ids).toHaveLength(1);
      expect(state2.entities[product.sku]).toMatchInlineSnapshot(`
        Object {
          "available": false,
          "completenessLevel": 2,
          "longDescription": "some description",
          "manufacturer": "Microsoft",
          "name": "Updated product",
          "sku": "111",
        }
      `);
    });
  });
});
