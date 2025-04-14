import { createSelector, createSelectorFactory, resultMemoize } from '@ngrx/store';
import { isEqual } from 'lodash-es';
import { identity } from 'rxjs';

import { BreadcrumbItem } from 'ish-core/models/breadcrumb-item/breadcrumb-item.interface';
import { CategoryTree } from 'ish-core/models/category-tree/category-tree.model';
import { CategoryView, createCategoryView } from 'ish-core/models/category-view/category-view.model';
import { ProductVariationHelper } from 'ish-core/models/product-variation/product-variation.helper';
import {
  ProductView,
  createProductView,
  createVariationProductMasterView,
  createVariationProductView,
} from 'ish-core/models/product-view/product-view.model';
import {
  AllProductTypes,
  ProductCompletenessLevel,
  ProductHelper,
  VariationProduct,
} from 'ish-core/models/product/product.model';
import { generateCategoryUrl } from 'ish-core/routing/category/category.route';
import { selectRouteParam } from 'ish-core/store/core/router';
import { getCategoryTree, getSelectedCategory } from 'ish-core/store/shopping/categories';
import { getAvailableFilter } from 'ish-core/store/shopping/filter';
import { getShoppingState } from 'ish-core/store/shopping/shopping-store';

import { ProductsState, productAdapter } from './products.reducer';

const getProductsState = createSelector(getShoppingState, state => state.products);

export const { selectEntities: getProductEntities } = productAdapter.getSelectors(getProductsState);

function productOrFailedStub(state: ProductsState, sku: string) {
  return state.failed.includes(sku) ? { sku, failed: true } : state.entities[sku];
}

const internalRawProduct = (sku: string) =>
  /* memoization manually by output: products are merged in the state */
  createSelectorFactory<object, AllProductTypes>(projector => resultMemoize(projector, isEqual))(
    getProductsState,
    (state: ProductsState) => productOrFailedStub(state, sku)
  );

const internalProductDefaultCategory = (sku: string) =>
  /* memoization manually by output: category object changes as CategoryTree does deep merges */
  createSelectorFactory<object, CategoryView>(projector => resultMemoize(projector, isEqual))(
    getCategoryTree,
    internalRawProduct(sku),
    (tree: CategoryTree, product: AllProductTypes) => createCategoryView(tree, product?.defaultCategoryId)
  );

const internalProductDefaultVariationSKU = (sku: string) =>
  /* memoization automatically by output: string identity */
  createSelector(getProductsState, state => state.defaultVariation[sku]);

export const getProductVariationSKUs = (sku: string) =>
  /* memoization automatically by output: object identity */
  createSelector(getProductsState, (state: ProductsState) => {
    const product = state.entities[sku];
    if (ProductHelper.isVariationProduct(product)) {
      return state.variations[product.productMasterSKU];
    }
    return state.variations[sku];
  });

export const getProductVariations = (sku: string) =>
  /* memoization manually by output: variation SKUs don't vary, but reference to state changes often */
  createSelectorFactory<object, VariationProduct[]>(projector => resultMemoize(projector, isEqual))(
    getProductsState,
    getProductVariationSKUs(sku),
    (state: ProductsState, variations: string[]) =>
      variations?.map(variationSku => productOrFailedStub(state, variationSku)) || []
  );

export const getProduct = (sku: string) =>
  /* memoization automatically by inputs: as long as all dependant selectors are properly memoized */
  createSelector(
    internalRawProduct(sku),
    internalProductDefaultCategory(sku),
    internalProductDefaultVariationSKU(sku),
    (product, defaultCategory, defaultVariationSKU): ProductView =>
      ProductHelper.isMasterProduct(product)
        ? createVariationProductMasterView(product, defaultVariationSKU, defaultCategory)
        : ProductHelper.isVariationProduct(product)
        ? createVariationProductView(product, defaultCategory)
        : createProductView(product, defaultCategory)
  );

export const getSelectedProduct = createSelectorFactory<object, ProductView>(projector =>
  resultMemoize(projector, isEqual)
)(identity, selectRouteParam('sku'), (state: object, sku: string) => getProduct(sku)(state));

export const getProductVariationCount = (sku: string) =>
  createSelector(
    getAvailableFilter,
    getProduct(sku),
    getProductVariations(sku),
    (filters, product, variations) =>
      ProductHelper.isMasterProduct(product) && ProductVariationHelper.productVariationCount(variations, filters)
  );

export const getProductLinks = (sku: string) => createSelector(getProductsState, state => state.links[sku]);

export const getProductParts = (sku: string) => createSelector(getProductsState, state => state.parts[sku]);

export const getFailedProducts = createSelector(getProductsState, state => state.failed);

export const getBreadcrumbForProductPage = createSelectorFactory<object, BreadcrumbItem[]>(projector =>
  resultMemoize(projector, isEqual)
)(
  getSelectedProduct,
  getSelectedCategory,
  getCategoryTree,
  (product: ProductView, category: CategoryView, tree: CategoryTree): BreadcrumbItem[] =>
    ProductHelper.isSufficientlyLoaded(product, ProductCompletenessLevel.Detail)
      ? (category?.categoryPath || product.defaultCategory?.categoryPath || [])
          .map(id => createCategoryView(tree, id))
          .filter(x => !!x)
          .map(cat => ({
            text: cat.name,
            link: generateCategoryUrl(cat),
          }))
          .concat([{ text: product.name, link: undefined }])
      : undefined
);
