import { Dictionary } from '@ngrx/entity';
import { createSelector, createSelectorFactory, defaultMemoize } from '@ngrx/store';
import { isEqual, memoize } from 'lodash-es';

import { CategoryTree } from 'ish-core/models/category-tree/category-tree.model';
import { CategoryView } from 'ish-core/models/category-view/category-view.model';
import { Category } from 'ish-core/models/category/category.model';
import { ProductVariationHelper } from 'ish-core/models/product-variation/product-variation.helper';
import {
  ProductView,
  VariationProductMasterView,
  VariationProductView,
  createProductView,
  createVariationProductMasterView,
  createVariationProductView,
} from 'ish-core/models/product-view/product-view.model';
import { Product, ProductCompletenessLevel, ProductHelper } from 'ish-core/models/product/product.model';
import { generateCategoryUrl } from 'ish-core/routing/category/category.route';
import { selectRouteParam } from 'ish-core/store/core/router';
import { getCategoryEntities, getCategoryTree, getSelectedCategory } from 'ish-core/store/shopping/categories';
import { getAvailableFilter } from 'ish-core/store/shopping/filter';
import { getShoppingState } from 'ish-core/store/shopping/shopping-store';

import { productAdapter } from './products.reducer';

const getProductsState = createSelector(getShoppingState, state => state.products);

export const { selectEntities: getProductEntities } = productAdapter.getSelectors(getProductsState);

const getFailed = createSelector(getProductsState, state => state.failed);

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
      return JSON.stringify([product, defaultCategory, entities[product.productMasterSKU]]);
    }
    if (ProductHelper.isMasterProduct(product)) {
      return JSON.stringify([
        product,
        defaultCategory,
        product.variationSKUs && product.variationSKUs.map(sku => entities[sku]),
      ]);
    }
    // fire when self or default category changed
    return JSON.stringify([product, defaultCategory]);
  }
);

function createFailedOrProductView(sku: string, failed, entities, tree) {
  if (failed.includes(sku)) {
    // tslint:disable-next-line: ish-no-object-literal-type-assertion
    return createProductView({ sku, failed: true } as Product, tree);
  }
  return createView(entities[sku], entities, tree);
}

export const getProduct = createSelector(
  getCategoryTree,
  getProductEntities,
  getFailed,
  (tree, entities, failed, props: { sku: string }): ProductView | VariationProductView | VariationProductMasterView =>
    createFailedOrProductView(props.sku, failed, entities, tree)
);

export const getSelectedProduct = createSelector(
  state => state,
  selectRouteParam('sku'),
  (state, sku): ProductView | VariationProductView | VariationProductMasterView => getProduct(state, { sku })
);

export const getProductVariationCount = createSelector(
  getProduct,
  getAvailableFilter,
  (product, filters) =>
    ProductHelper.isMasterProduct(product) && ProductVariationHelper.productVariationCount(product, filters)
);

export const getProductLinks = (sku: string) => createSelector(getProductsState, state => state.links[sku]);

export const getProductParts = (sku: string) => createSelector(getProductsState, state => state.parts[sku]);

export const getBreadcrumbForProductPage = createSelectorFactory(projector =>
  defaultMemoize(projector, undefined, isEqual)
)(
  getSelectedProduct,
  getSelectedCategory,
  getCategoryEntities,
  (product: ProductView, category: CategoryView, entities: Dictionary<Category>) =>
    ProductHelper.isSufficientlyLoaded(product, ProductCompletenessLevel.Detail)
      ? (category?.categoryPath || product.defaultCategory()?.categoryPath || [])
          .map(id => entities[id])
          .filter(x => !!x)
          .map(cat => ({
            text: cat.name,
            link: generateCategoryUrl(cat),
          }))
          .concat([{ text: product.name, link: undefined }])
      : undefined
);
