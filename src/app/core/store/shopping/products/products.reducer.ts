import { EntityState, createEntityAdapter } from '@ngrx/entity';

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
        selected: action.payload.sku,
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
      return productAdapter.upsertOne(action.payload.product, { ...state, loading: false });
    }
  }

  return state;
}
