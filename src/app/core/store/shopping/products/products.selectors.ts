import { createSelector } from '@ngrx/store';

import { ProductVariationHelper } from 'ish-core/models/product-variation/product-variation.helper';
import { VariationProductView, createProductView } from 'ish-core/models/product-view/product-view.model';
import { Product, ProductHelper } from 'ish-core/models/product/product.model';
import { getCategoryTree } from '../categories';
import { getShoppingState } from '../shopping-store';

import { productAdapter } from './products.reducer';

// all this is just placed here temporarily

///////////////////////////

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

export const getProductVariations = createSelector(
  getProductsState,
  products => products.variations
);

export const getSelectedProduct = createSelector(
  getCategoryTree,
  getProductEntities,
  getSelectedProductId,
  getProductVariations,
  (tree, entities, id, variationsMap) => {
    const product = createProductView(entities[id], tree);

    // for master product, add variations
    if (ProductHelper.isMasterProduct(product)) {
      const variations = variationsMap[product.sku];

      if (!variationsMap || !variations) {
        return;
      }

      return {
        ...product,
        variations: variationsMap[product.sku],
      };
    }

    // for variation product, add master and master's variations
    if (ProductHelper.isVariationProduct(product)) {
      const productMaster = createProductView(entities[product.productMasterSKU], tree);

      if (!productMaster || !variationsMap) {
        return;
      }

      return {
        ...product,
        productMaster,
        variations: variationsMap[productMaster.sku],
      };
    }

    return product;
  }
);

export const getSelectedProductVariationOptions = createSelector(
  getSelectedProduct,
  product => {
    if (ProductHelper.isVariationProduct(product) && ProductHelper.hasVariations(product)) {
      return ProductVariationHelper.buildVariationOptionGroups(product as VariationProductView);
    }
  }
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

export const getProductLoading = createSelector(
  getProductsState,
  products => products.loading
);
