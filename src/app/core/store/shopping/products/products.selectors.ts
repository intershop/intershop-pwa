import { createSelector } from '@ngrx/store';

import { Product } from '../../../models/product/product.model';
import { ShoppingState, getShoppingState } from '../shopping-store';

import { productAdapter } from './products.reducer';

const getProductsState = createSelector(
  getShoppingState,
  (state: ShoppingState) => state.products
);

export const {
  selectEntities: getProductEntities,
  selectAll: getProducts,
  selectIds: getProductIds,
} = productAdapter.getSelectors(getProductsState);

export const getSelectedProductId = createSelector(
  getProductsState,
  state => state.selected
);

export const getSelectedProduct = createSelector(
  getProductEntities,
  getSelectedProductId,
  (entities, id): Product => entities[id]
);

export const getProductLoading = createSelector(
  getProductsState,
  products => products.loading
);

export const getProduct = createSelector(
  getProductEntities,
  (products, props) => products[props.sku]
);
