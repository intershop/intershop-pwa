import { createSelector } from '@ngrx/store';

import { VariationProductMasterView, createProductView } from 'ish-core/models/product-view/product-view.model';
import { Product, ProductHelper } from 'ish-core/models/product/product.model';
import { getCategoryTree } from '../categories';
import { getShoppingState } from '../shopping-store';

import { productAdapter } from './products.reducer';

const getProductsState = createSelector(
  getShoppingState,
  state => state.products
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
  (tree, entities, id) => createProductView(entities[id], tree)
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

export const getProductVariations = createSelector(
  getProductsState,
  products => products.variations
);

export const getSelectedProductVariations = createSelector(
  getSelectedProduct,
  getProductVariations,
  (product, variations) => {
    if (ProductHelper.isMasterProduct(product)) {
      return variations[product.sku] || [];
    }

    if (ProductHelper.isVariationProduct(product)) {
      return variations[product.productMasterSKU] || [];
    }

    return [];
  }
);

export const getSelectedMasterProduct = createSelector(
  getCategoryTree,
  getProductEntities,
  getSelectedProduct,
  (tree, entities, product): VariationProductMasterView => {
    if (ProductHelper.isMasterProduct(product)) {
      return product;
    }
    if (ProductHelper.isVariationProduct(product)) {
      const masterProduct = entities[product.productMasterSKU];
      return createProductView(masterProduct, tree);
    }
  }
);

export const getProductLoading = createSelector(
  getProductsState,
  products => products.loading
);
