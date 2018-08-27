import { createSelector } from '@ngrx/store';

import { createProductView } from 'ish-core/models/product-view/product-view.model';
import { VariationProductMaster } from 'ish-core/models/product/product-variation-master.model';
import { VariationProduct } from 'ish-core/models/product/product-variation.model';
import { Product, ProductType } from '../../../models/product/product.model';
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
    if (product && product.type === ProductType.VariationProductMaster && variations[product.sku]) {
      return variations[product.sku];
    }
    if (
      product &&
      product.type === ProductType.VariationProduct &&
      variations[(product as VariationProduct).productMasterSKU]
    ) {
      return variations[(product as VariationProduct).productMasterSKU];
    }

    return [];
  }
);

export const getSelectedMasterProduct = createSelector(
  getProductEntities,
  getSelectedProduct,
  (entities, product): VariationProductMaster => {
    if (product && product.type === ProductType.VariationProductMaster) {
      return product as VariationProductMaster;
    }
    if (product && product.type === ProductType.VariationProduct) {
      return entities[(product as VariationProduct).productMasterSKU] as VariationProductMaster;
    }
  }
);

export const getProductLoading = createSelector(
  getProductsState,
  products => products.loading
);
