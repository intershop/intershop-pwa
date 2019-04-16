import { EntityState, createEntityAdapter } from '@ngrx/entity';

import { VariationProductMaster } from 'ish-core/models/product/product-variation-master.model';
import { VariationProduct } from 'ish-core/models/product/product-variation.model';
import { Product } from 'ish-core/models/product/product.model';

import { ProductsAction, ProductsActionTypes } from './products.actions';

export const productAdapter = createEntityAdapter<Product | VariationProduct | VariationProductMaster>({
  selectId: product => product.sku,
});

export interface ProductsState extends EntityState<Product | VariationProduct | VariationProductMaster> {
  loading: boolean;
  selected: string;
  failed: string[];
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
      const oldProduct = state.entities[product.sku];
      if (!oldProduct || product.completenessLevel >= oldProduct.completenessLevel) {
        return productAdapter.upsertOne(product, {
          ...state,
          loading: false,
          failed: removeFailed(state.failed, product.sku),
        });
      }
      break;
    }

    case ProductsActionTypes.LoadProductVariationsSuccess: {
      return productAdapter.updateOne(
        { id: action.payload.sku, changes: { variationSKUs: action.payload.variations } },
        { ...state, loading: false }
      );
    }
  }

  return state;
}
