import { Dictionary } from '@ngrx/entity';
import { createSelector, createSelectorFactory, resultMemoize } from '@ngrx/store';
import { isEqual } from 'lodash-es';
import { identity } from 'rxjs';

import { BreadcrumbItem } from 'ish-core/models/breadcrumb-item/breadcrumb-item.interface';
import { CategoryView } from 'ish-core/models/category-view/category-view.model';
import { Category } from 'ish-core/models/category/category.model';
import { ProductVariationHelper } from 'ish-core/models/product-variation/product-variation.helper';
import {
  ProductView,
  createProductView,
  createVariationProductMasterView,
  createVariationProductView,
} from 'ish-core/models/product-view/product-view.model';
import {
  AllProductTypes,
  Product,
  ProductCompletenessLevel,
  ProductHelper,
  VariationProduct,
  VariationProductMaster,
} from 'ish-core/models/product/product.model';
import { generateCategoryUrl } from 'ish-core/routing/category/category.route';
import { selectRouteParam } from 'ish-core/store/core/router';
import { getCategoryEntities, getSelectedCategory } from 'ish-core/store/shopping/categories';
import { getAvailableFilter } from 'ish-core/store/shopping/filter';
import { getShoppingState } from 'ish-core/store/shopping/shopping-store';

import { ProductsState, productAdapter } from './products.reducer';

const getProductsState = createSelector(getShoppingState, state => state.products);

export const { selectEntities: getProductEntities } = productAdapter.getSelectors(getProductsState);

function productOrFailedStub(state: ProductsState, sku: string) {
  // tslint:disable-next-line: ish-no-object-literal-type-assertion
  return state.failed.includes(sku) ? ({ sku, failed: true } as Product) : state.entities[sku];
}

const internalRawProduct = (sku: string) =>
  /* memoization manually by output: products are merged in the state */
  createSelectorFactory<object, AllProductTypes>(projector => resultMemoize(projector, isEqual))(
    getProductsState,
    (state: ProductsState) => productOrFailedStub(state, sku)
  );

const internalProductDefaultCategory = (sku: string) =>
  /* memoization manually by output: category object changes as CategoryTree does deep merges */
  createSelectorFactory<object, Category>(projector => resultMemoize(projector, isEqual))(
    getCategoryEntities,
    internalRawProduct(sku),
    (categories: Dictionary<Category>, product: AllProductTypes) => categories[product?.defaultCategoryId]
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

const internalProductVariations = (sku: string) =>
  /* memoization manually by output: variation SKUs don't vary, but reference to state changes often */
  createSelectorFactory<object, VariationProduct[]>(projector => resultMemoize(projector, isEqual))(
    getProductsState,
    getProductVariationSKUs(sku),
    (state: ProductsState, variations: string[]) =>
      variations?.map(variationSku => productOrFailedStub(state, variationSku)) || []
  );

const internalProductMasterSKU = (sku: string) =>
  /* memoization automatically by output: string identity */
  createSelector(
    internalRawProduct(sku),
    product => ProductHelper.isVariationProduct(product) && product.productMasterSKU
  );

const internalProductMaster = (sku: string) =>
  /* memoization manually by output: master SKU doesn't vary, but reference to state changes often */
  createSelectorFactory<object, VariationProductMaster>(projector => resultMemoize(projector, isEqual))(
    getProductsState,
    internalProductMasterSKU(sku),
    productOrFailedStub
  );

export const getProduct = (sku: string) =>
  /* memoization automatically by inputs: as long as all dependant selectors are properly memoized */
  createSelector(
    internalRawProduct(sku),
    internalProductDefaultCategory(sku),
    internalProductDefaultVariationSKU(sku),
    internalProductVariations(sku),
    internalProductMaster(sku),
    (product, defaultCategory, defaultVariationSKU, variations, productMaster): ProductView =>
      ProductHelper.isMasterProduct(product)
        ? createVariationProductMasterView(product, defaultVariationSKU, variations, defaultCategory)
        : ProductHelper.isVariationProduct(product)
        ? createVariationProductView(product, variations, productMaster, defaultCategory)
        : createProductView(product, defaultCategory)
  );

export const getSelectedProduct = createSelectorFactory<object, ProductView>(projector =>
  resultMemoize(projector, isEqual)
)(identity, selectRouteParam('sku'), (state: object, sku: string) => getProduct(sku)(state));

export const getProductVariationCount = (sku: string) =>
  createSelector(
    getAvailableFilter,
    getProduct(sku),
    (filters, product) =>
      ProductHelper.isMasterProduct(product) && ProductVariationHelper.productVariationCount(product, filters)
  );

export const getProductLinks = (sku: string) => createSelector(getProductsState, state => state.links[sku]);

export const getProductParts = (sku: string) => createSelector(getProductsState, state => state.parts[sku]);

export const getBreadcrumbForProductPage = createSelectorFactory<object, BreadcrumbItem[]>(projector =>
  resultMemoize(projector, isEqual)
)(
  getSelectedProduct,
  getSelectedCategory,
  getCategoryEntities,
  (product: ProductView, category: CategoryView, entities: Dictionary<Category>): BreadcrumbItem[] =>
    ProductHelper.isSufficientlyLoaded(product, ProductCompletenessLevel.Detail)
      ? (category?.categoryPath || product.defaultCategory?.categoryPath || [])
          .map(id => entities[id])
          .filter(x => !!x)
          .map(cat => ({
            text: cat.name,
            link: generateCategoryUrl(cat),
          }))
          .concat([{ text: product.name, link: undefined }])
      : undefined
);
