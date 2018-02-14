import { Product } from '../../../models/product/product.model';
import * as fromActions from './products.actions';

describe('Products Actions', () => {
  describe('LoadProduct Actions', () => {
    it('LoadProduct should create a new action', () => {
      const payload = '123';
      const action = new fromActions.LoadProduct(payload);

      expect({ ...action }).toEqual({
        type: fromActions.LOAD_PRODUCT,
        payload
      });
    });

    it('LoadProductFail should create a new action', () => {
      const payload = '123';
      const action = new fromActions.LoadProductFail(payload);

      expect({ ...action }).toEqual({
        type: fromActions.LOAD_PRODUCT_FAIL,
        payload
      });
    });

    it('LoadProductSuccess should create a new action', () => {
      const payload = { sku: '123' } as Product;
      const action = new fromActions.LoadProductSuccess(payload);

      expect({ ...action }).toEqual({
        type: fromActions.LOAD_PRODUCT_SUCCESS,
        payload
      });
    });
  });
});
