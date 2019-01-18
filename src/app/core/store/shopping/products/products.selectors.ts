import { createSelector } from '@ngrx/store';

import { createProductView } from 'ish-core/models/product-view/product-view.model';
import { Product } from '../../../models/product/product.model';
import { getCategoryTree } from '../categories';
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

export const getFailed = createSelector(
  getProductsState,
  state => state.failed
);

export const getSelectedProduct = createSelector(
  getCategoryTree,
  getProductEntities,
  getSelectedProductId,
  (tree, entities, id): Product => createProductView(entities[id], tree)
);

export const getProductLoading = createSelector(
  getProductsState,
  products => products.loading
);

export const getProduct = createSelector(
  getCategoryTree,
  getProductEntities,
  getFailed,
  (tree, products, failed, props: { sku: string }) =>
    failed.includes(props.sku)
      ? // tslint:disable-next-line:ish-no-object-literal-type-assertion
        createProductView({ sku: props.sku } as Product, tree)
      : createProductView(products[props.sku], tree)
);
