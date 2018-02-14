import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Product } from '../../../models/product/product.model';
import * as fromProducts from '../actions/products.actions';
import { ProductsActionTypes } from './products.actions';

export const productAdapter: EntityAdapter<Product> = createEntityAdapter<Product>({
  selectId: product => product.sku
});

export interface ProductsState extends EntityState<Product> {
  loading: boolean;
}

export const initialState: ProductsState = productAdapter.getInitialState({
  loading: false
});

export function reducer(
  state = initialState,
  action: fromProducts.ProductAction
): ProductsState {
  switch (action.type) {

    // TODO: set loading for specific entities (from payload/sku) and check if this is loading/loaded
    case ProductsActionTypes.LOAD_PRODUCT: {
      return {
        ...state,
        loading: true
      };
    }

    case ProductsActionTypes.LOAD_PRODUCT_FAIL: {
      return {
        ...state,
        loading: false
      };
    }

    case ProductsActionTypes.LOAD_PRODUCT_SUCCESS: {
      const loadedProduct = action.payload;

      return {
        ...productAdapter.addOne(loadedProduct, state),
        loading: false
      };
    }
  }

  return state;
}
