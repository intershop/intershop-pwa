import { createSelector } from '@ngrx/store';
import { memoize } from 'lodash-es';

import { CategoryTree } from 'ish-core/models/category-tree/category-tree.model';
import { ProductVariationHelper } from 'ish-core/models/product-variation/product-variation.helper';
import {
  ProductView,
  VariationProductMasterView,
  VariationProductView,
  createProductView,
  createVariationProductMasterView,
  createVariationProductView,
} from 'ish-core/models/product-view/product-view.model';
import { Product, ProductHelper } from 'ish-core/models/product/product.model';
import { getCategoryTree } from '../categories';
import { getShoppingState } from '../shopping-store';

import { productAdapter } from './products.reducer';

const getProductsState = createSelector(
  getShoppingState,
  state => state.products
);

const productToVariationOptions = (product: ProductView | VariationProductView | VariationProductMasterView) => {
  if (ProductHelper.isVariationProduct(product) && ProductHelper.hasVariations(product)) {
    return ProductVariationHelper.buildVariationOptionGroups(product);
  }
};

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

const createView = memoize(
  (product, entities, tree) => {
    if (ProductHelper.isMasterProduct(product)) {
      return createVariationProductMasterView(product, entities, tree);
    } else if (ProductHelper.isVariationProduct(product)) {
      return createVariationProductView(product, entities, tree);
    } else {
      return createProductView(product, tree);
    }
  },
  // TODO: find a better way to return hash than stringify
  (product, entities, tree: CategoryTree) => {
    const defaultCategory = product ? tree.nodes[product.defaultCategoryId] : undefined;
    // fire when self, master or default category changed
    if (ProductHelper.isVariationProduct(product)) {
      return JSON.stringify([product, entities[product.productMasterSKU], defaultCategory]);
    }
    // fire when self or default category changed
    return JSON.stringify([product, defaultCategory]);
  }
);

export const getProduct = createSelector(
  getCategoryTree,
  getProductEntities,
  getFailed,
  (tree, entities, failed, props: { sku: string }): ProductView | VariationProductView | VariationProductMasterView => {
    if (failed.includes(props.sku)) {
      // tslint:disable-next-line: ish-no-object-literal-type-assertion
      return createProductView({ sku: props.sku, failed: true } as Product, tree);
    }

    return createView(entities[props.sku], entities, tree);
  }
);

export const getSelectedProduct = createSelector(
  state => state,
  getSelectedProductId,
  getFailed,
  (state, sku, failed): ProductView | VariationProductView | VariationProductMasterView =>
    failed.includes(sku) ? undefined : getProduct(state, { sku })
);

export const getProductVariationOptions = createSelector(
  getProduct,
  productToVariationOptions
);

export const getSelectedProductVariationOptions = createSelector(
  getSelectedProduct,
  productToVariationOptions
);

export const getProductLoading = createSelector(
  getProductsState,
  products => products.loading
);
