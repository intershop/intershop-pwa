import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Product } from '../../../models/product/product.model';
import { ProductsAction, ProductsActionTypes } from './products.actions';

export const productAdapter: EntityAdapter<Product> = createEntityAdapter<Product>({
  selectId: product => product.sku
});

export interface ProductsState extends EntityState<Product> {
  loading: boolean;
}

export const initialState: ProductsState = productAdapter.getInitialState({
  loading: false
});

export function productsReducer(
  state = initialState,
  action: ProductsAction
): ProductsState {
  switch (action.type) {

    // TODO: set loading for specific entities (from payload/sku) and check if this is loading/loaded
    case ProductsActionTypes.LoadProduct: {
      return {
        ...state,
        loading: true
      };
    }

    case ProductsActionTypes.LoadProductFail: {
      return {
        ...state,
        loading: false
      };
    }

    case ProductsActionTypes.LoadProductSuccess: {
      const loadedProduct = action.payload;

      return {
        ...productAdapter.addOne(loadedProduct, state),
        loading: false
      };
    }
  }

  return state;
}
