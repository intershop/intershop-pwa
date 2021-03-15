import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';

import { ProductLinksDictionary } from 'ish-core/models/product-links/product-links.model';
import { AllProductTypes, SkuQuantityType } from 'ish-core/models/product/product.model';

import {
  loadProductFail,
  loadProductLinksSuccess,
  loadProductPartsSuccess,
  loadProductSuccess,
  loadProductVariationsFail,
  loadProductVariationsSuccess,
  productSpecialUpdate,
} from './products.actions';

export const productAdapter = createEntityAdapter<AllProductTypes>({
  selectId: product => product.sku,
});

export interface ProductsState extends EntityState<AllProductTypes> {
  failed: string[];
  links: { [sku: string]: ProductLinksDictionary };
  parts: { [sku: string]: SkuQuantityType[] };
  variations: { [sku: string]: string[] };
  defaultVariation: { [sku: string]: string };
}

export const initialState: ProductsState = productAdapter.getInitialState({
  failed: [],
  links: {},
  parts: {},
  variations: {},
  defaultVariation: {},
});

function addFailed(failed: string[], sku: string): string[] {
  return [...failed, sku].filter((val, idx, arr) => arr.indexOf(val) === idx);
}

function removeFailed(failed: string[], sku: string): string[] {
  return failed.filter(val => val !== sku);
}

export const productsReducer = createReducer(
  initialState,
  on(loadProductFail, loadProductVariationsFail, (state, action) => ({
    ...state,
    failed: addFailed(state.failed, action.payload.sku),
  })),
  on(loadProductSuccess, (state, action) => {
    const product = action.payload.product;
    const oldProduct = state.entities[product.sku] || { completenessLevel: 0 };

    const newProduct = { ...product };
    if (product.completenessLevel || (oldProduct && oldProduct.completenessLevel)) {
      newProduct.completenessLevel = Math.max(product.completenessLevel, oldProduct.completenessLevel);
    }

    return productAdapter.upsertOne(newProduct as AllProductTypes, {
      ...state,
      failed: removeFailed(state.failed, product.sku),
    });
  }),
  on(loadProductVariationsSuccess, (state, action) => ({
    ...state,
    variations: { ...state.variations, [action.payload.sku]: action.payload.variations },
    defaultVariation: { ...state.defaultVariation, [action.payload.sku]: action.payload.defaultVariation },
  })),
  on(loadProductPartsSuccess, (state, action) => ({
    ...state,
    parts: { ...state.parts, [action.payload.sku]: action.payload.parts },
  })),
  on(loadProductLinksSuccess, (state, action) => ({
    ...state,
    links: { ...state.links, [action.payload.sku]: action.payload.links },
  })),
  on(productSpecialUpdate, (state, action) =>
    productAdapter.updateOne({ id: action.payload.sku, changes: action.payload.update }, state)
  )
);
