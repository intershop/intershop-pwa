import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Product } from '../../../models/product/product.model';
import * as fromProducts from '../actions/products.actions';

export const productAdapter: EntityAdapter<Product> = createEntityAdapter<Product>({
  selectId: product => product.sku
});

export interface ProductsState extends EntityState<Product> {
  loaded: boolean;
  loading: boolean;
}

export const initialState: ProductsState = {
  ...productAdapter.getInitialState(),
  loaded: false,
  loading: false,
};

export function reducer(
  state = initialState,
  action: fromProducts.ProductAction
): ProductsState {
  switch (action.type) {

    // TODO: set loading for specific entities (from payload/sku) and check if this is loading/loaded
    case fromProducts.LOAD_PRODUCT: {
      return {
        ...state,
        loading: true
      };
    }

    case fromProducts.LOAD_PRODUCT_FAIL: {
      return {
        ...state,
        loading: false,
        loaded: false
      };
    }

    case fromProducts.LOAD_PRODUCT_SUCCESS: {
      const loadedProduct = action.payload;

      return {
        ...productAdapter.addOne(loadedProduct, state),
        loading: false,
        loaded: true,
      };
    }

  }

  return state;
}

export const getProductEntities = (state: ProductsState) => state.entities;
export const getProductLoading = (state: ProductsState) => state.loading;
export const getProductLoaded = (state: ProductsState) => state.loaded;
