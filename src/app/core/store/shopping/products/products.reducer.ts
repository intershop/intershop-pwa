import { EntityState, createEntityAdapter } from '@ngrx/entity';

import { Product } from '../../../models/product/product.model';

import { ProductsAction, ProductsActionTypes } from './products.actions';

export const productAdapter = createEntityAdapter<Product>({
  selectId: product => product.sku,
});

export interface ProductsState extends EntityState<Product> {
  loading: boolean;
  selected: string;
  failed: string[];
  variations: {};
}

export const initialState: ProductsState = productAdapter.getInitialState({
  loading: false,
  selected: undefined,
  failed: [],
  variations: {},
});

function addFailed(failed: string[], sku: string): string[] {
  return [...failed, sku].filter((val, idx, arr) => arr.indexOf(val) === idx);
}

function removeFailed(failed: string[], sku: string): string[] {
  return failed.filter(val => val !== sku);
}

export function productsReducer(state = initialState, action: ProductsAction): ProductsState {
  switch (action.type) {
    case ProductsActionTypes.SelectProduct: {
      return {
        ...state,
        selected: action.payload.sku,
      };
    }

    case ProductsActionTypes.LoadProduct:
    case ProductsActionTypes.LoadProductVariations: {
      return {
        ...state,
        loading: true,
      };
    }

    case ProductsActionTypes.LoadProductFail:
    case ProductsActionTypes.LoadProductVariationsFail: {
      return {
        ...state,
        loading: false,
        failed: addFailed(state.failed, action.payload.sku),
      };
    }

    case ProductsActionTypes.LoadProductSuccess: {
      const product = action.payload.product;
      return productAdapter.upsertOne(product, {
        ...state,
        loading: false,
        failed: removeFailed(state.failed, product.sku),
      });
    }

    case ProductsActionTypes.LoadProductVariationsSuccess: {
      const loadedVariations = action.payload.variations;
      const sku = action.payload.sku;

      const variationEntries = {
        ...state.variations,
        [sku]: loadedVariations,
      };

      return { ...state, variations: variationEntries, loading: false };
    }
  }

  return state;
}
