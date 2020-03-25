import { EntityState, createEntityAdapter } from '@ngrx/entity';

import { AllProductTypes } from 'ish-core/models/product/product.model';

import { ProductsAction, ProductsActionTypes } from './products.actions';

export const productAdapter = createEntityAdapter<AllProductTypes>({
  selectId: product => product.sku,
});

export interface ProductsState extends EntityState<AllProductTypes> {
  loading: boolean;
  failed: string[];
}

export const initialState: ProductsState = productAdapter.getInitialState({
  loading: false,
  failed: [],
});

function addFailed(failed: string[], sku: string): string[] {
  return [...failed, sku].filter((val, idx, arr) => arr.indexOf(val) === idx);
}

function removeFailed(failed: string[], sku: string): string[] {
  return failed.filter(val => val !== sku);
}

export function productsReducer(state = initialState, action: ProductsAction): ProductsState {
  switch (action.type) {
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
      const oldProduct = state.entities[product.sku] || { completenessLevel: 0 };

      const newProduct = { ...product };
      if (product.completenessLevel || (oldProduct && oldProduct.completenessLevel)) {
        newProduct.completenessLevel = Math.max(product.completenessLevel, oldProduct.completenessLevel);
      }

      return productAdapter.upsertOne(newProduct, {
        ...state,
        loading: false,
        failed: removeFailed(state.failed, product.sku),
      });
    }

    case ProductsActionTypes.LoadProductVariationsSuccess: {
      return productAdapter.updateOne(
        {
          id: action.payload.sku,
          changes: { variationSKUs: action.payload.variations, defaultVariationSKU: action.payload.defaultVariation },
        },
        { ...state, loading: false }
      );
    }

    case ProductsActionTypes.LoadProductBundlesSuccess: {
      return productAdapter.updateOne(
        { id: action.payload.sku, changes: { bundledProducts: action.payload.bundledProducts } },
        { ...state, loading: false }
      );
    }

    case ProductsActionTypes.LoadRetailSetSuccess: {
      return productAdapter.updateOne({ id: action.payload.sku, changes: { partSKUs: action.payload.parts } }, state);
    }

    case ProductsActionTypes.LoadProductLinksSuccess: {
      return productAdapter.updateOne(
        { id: action.payload.sku, changes: { links: action.payload.links } },
        { ...state, loading: false }
      );
    }
  }

  return state;
}
