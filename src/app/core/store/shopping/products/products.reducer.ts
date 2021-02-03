import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';

import { ProductLinksDictionary } from 'ish-core/models/product-links/product-links.model';
import { AllProductTypes } from 'ish-core/models/product/product.model';

import {
  loadProductBundlesSuccess,
  loadProductFail,
  loadProductLinksSuccess,
  loadProductSuccess,
  loadProductVariationsFail,
  loadProductVariationsSuccess,
  loadRetailSetSuccess,
  productSpecialUpdate,
} from './products.actions';

export const productAdapter = createEntityAdapter<AllProductTypes>({
  selectId: product => product.sku,
});

export interface ProductsState extends EntityState<AllProductTypes> {
  failed: string[];
  links: { [sku: string]: ProductLinksDictionary };
}

export const initialState: ProductsState = productAdapter.getInitialState({
  failed: [],
  links: {},
});

function addFailed(failed: string[], sku: string): string[] {
  return [...failed, sku].filter((val, idx, arr) => arr.indexOf(val) === idx);
}

function removeFailed(failed: string[], sku: string): string[] {
  return failed.filter(val => val !== sku);
}

export const productsReducer = createReducer(
  initialState,
  on(loadProductFail, loadProductVariationsFail, (state: ProductsState, action) => ({
    ...state,
    failed: addFailed(state.failed, action.payload.sku),
  })),
  on(loadProductSuccess, (state: ProductsState, action) => {
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
  }),
  on(loadProductVariationsSuccess, (state: ProductsState, action) =>
    productAdapter.updateOne(
      {
        id: action.payload.sku,
        changes: { variationSKUs: action.payload.variations, defaultVariationSKU: action.payload.defaultVariation },
      },
      { ...state, loading: false }
    )
  ),
  on(loadProductBundlesSuccess, (state: ProductsState, action) =>
    productAdapter.updateOne(
      { id: action.payload.sku, changes: { bundledProducts: action.payload.bundledProducts } },
      { ...state, loading: false }
    )
  ),
  on(loadRetailSetSuccess, (state: ProductsState, action) =>
    productAdapter.updateOne({ id: action.payload.sku, changes: { partSKUs: action.payload.parts } }, state)
  ),
  on(loadProductLinksSuccess, (state: ProductsState, action) => ({
    ...state,
    links: { ...state.links, [action.payload.sku]: action.payload.links },
    loading: false,
  })),
  on(productSpecialUpdate, (state: ProductsState, action) =>
    productAdapter.updateOne({ id: action.payload.sku, changes: action.payload.update }, state)
  )
);
