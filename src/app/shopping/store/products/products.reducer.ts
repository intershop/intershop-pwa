import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { ProductMapper } from '../../../models/product/product.mapper';
import { Product } from '../../../models/product/product.model';
import { ProductsAction, ProductsActionTypes } from './products.actions';

export const productAdapter: EntityAdapter<Product> = createEntityAdapter<Product>({
  selectId: product => product.sku,
});

export interface ProductsState extends EntityState<Product> {
  loading: boolean;
}

export const initialState: ProductsState = productAdapter.getInitialState({
  loading: false,
});

export function productsReducer(state = initialState, action: ProductsAction): ProductsState {
  switch (action.type) {
    case ProductsActionTypes.LoadProduct: {
      return {
        ...state,
        loading: true,
      };
    }

    case ProductsActionTypes.LoadProductFail: {
      return {
        ...state,
        loading: false,
      };
    }

    case ProductsActionTypes.LoadProductSuccess: {
      const loadedProduct = action.payload;
      const { sku } = loadedProduct;

      let updatedState;

      if (state.entities[sku]) {
        const updated = ProductMapper.updateImmutably(state.entities[sku], loadedProduct);
        const entities = {
          ...state.entities,
          [sku]: updated,
        };
        updatedState = { ...state, entities };
      } else {
        updatedState = productAdapter.addOne(loadedProduct, state);
      }

      return { ...updatedState, loading: false };
    }
  }

  return state;
}
