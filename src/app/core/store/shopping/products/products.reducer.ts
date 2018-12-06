import { EntityState, createEntityAdapter } from '@ngrx/entity';

import { ProductMapper } from '../../../models/product/product.mapper';
import { Product } from '../../../models/product/product.model';

import { ProductsAction, ProductsActionTypes } from './products.actions';

export const productAdapter = createEntityAdapter<Product>({
  selectId: product => product.sku,
});

export interface ProductsState extends EntityState<Product> {
  loading: boolean;
  selected: string;
}

export const initialState: ProductsState = productAdapter.getInitialState({
  loading: false,
  selected: undefined,
});

export function productsReducer(state = initialState, action: ProductsAction): ProductsState {
  switch (action.type) {
    case ProductsActionTypes.SelectProduct: {
      return {
        ...state,
        selected: action.payload,
      };
    }

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
