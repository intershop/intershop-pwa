import { HttpErrorResponse } from '@angular/common/http';
import { Product } from '../../../models/product/product.model';
import * as fromActions from './products.actions';

describe('Products Actions', () => {
  describe('LoadProduct Actions', () => {
    it('should create new action for LoadProduct', () => {
      const payload = '123';
      const action = new fromActions.LoadProduct(payload);

      expect({ ...action }).toEqual({
        type: fromActions.ProductsActionTypes.LoadProduct,
        payload,
      });
    });

    it('should create new action for LoadProductFail', () => {
      const payload = { message: 'error' } as HttpErrorResponse;
      const action = new fromActions.LoadProductFail(payload);

      expect({ ...action }).toEqual({
        type: fromActions.ProductsActionTypes.LoadProductFail,
        payload,
      });
    });

    it('should create new action for LoadProductSuccess', () => {
      const payload = { sku: '123' } as Product;
      const action = new fromActions.LoadProductSuccess(payload);

      expect({ ...action }).toEqual({
        type: fromActions.ProductsActionTypes.LoadProductSuccess,
        payload,
      });
    });

    it('should create new action for LoadProductsForCategory', () => {
      const payload = '123';
      const action = new fromActions.LoadProductsForCategory(payload);

      expect({ ...action }).toEqual({
        type: fromActions.ProductsActionTypes.LoadProductsForCategory,
        payload,
      });
    });
  });
});
