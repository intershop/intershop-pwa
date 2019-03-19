import { createSelector } from '@ngrx/store';

import { ProductVariationHelper } from 'ish-core/models/product-variation/product-variation.helper';
import {
  ProductView,
  VariationProductMasterView,
  VariationProductView,
  createProductView,
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
    return ProductVariationHelper.buildVariationOptionGroups(product as VariationProductView);
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

export const getProductVariations = createSelector(
  getProductsState,
  products => products.variations
);

export const getProduct = createSelector(
  getCategoryTree,
  getProductEntities,
  getProductVariations,
  getFailed,
  (tree, entities, variationsMap, failed, props: { sku: string }) => {
    if (failed.includes(props.sku)) {
      // tslint:disable-next-line: ish-no-object-literal-type-assertion
      return createProductView({ sku: props.sku } as Product, tree);
    }

    const product = createProductView(entities[props.sku], tree);

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

export const getSelectedProduct = createSelector(
  state => state,
  getSelectedProductId,
  getFailed,
  (state, sku, failed) => (failed.includes(sku) ? undefined : getProduct(state, { sku }))
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
