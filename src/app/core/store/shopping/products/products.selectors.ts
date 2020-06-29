import { Dictionary } from '@ngrx/entity';
import { createSelector, createSelectorFactory, defaultMemoize } from '@ngrx/store';
import { isEqual, memoize } from 'lodash-es';

import { CategoryTree } from 'ish-core/models/category-tree/category-tree.model';
import { CategoryView, createCategoryView } from 'ish-core/models/category-view/category-view.model';
import { Category } from 'ish-core/models/category/category.model';
import { ProductLinks, ProductLinksView } from 'ish-core/models/product-links/product-links.model';
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
import { getShoppingState } from 'ish-core/store/shopping/shopping-store';

import { productAdapter } from './products.reducer';

const getProductsState = createSelector(getShoppingState, state => state.products);

const productToVariationOptions = memoize(
  product => {
    if (ProductHelper.isVariationProduct(product) && ProductHelper.hasVariations(product)) {
      return ProductVariationHelper.buildVariationOptionGroups(product);
    }
  },
  product =>
    `${product && product.sku}#${ProductHelper.isVariationProduct(product) && ProductHelper.hasVariations(product)}`
);

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

export const getProducts = createSelector(
  getCategoryTree,
  getProductEntities,
  getFailed,
  (
    tree,
    entities,
    failed,
    props: { skus: string[] }
  ): (ProductView | VariationProductView | VariationProductMasterView)[] =>
    props.skus.map(sku => createFailedOrProductView(sku, failed, entities, tree)).filter(x => !!x)
);

export const getSelectedProduct = createSelector(
  state => state,
  selectRouteParam('sku'),
  (state, sku): ProductView | VariationProductView | VariationProductMasterView => getProduct(state, { sku })
);

export const getProductVariationOptions = createSelector(getProduct, productToVariationOptions);

export const getSelectedProductVariationOptions = createSelector(getSelectedProduct, productToVariationOptions);

export const getProductBundleParts = createSelector(getProductEntities, (entities, props: { sku: string }): {
  product: Product;
  quantity: number;
}[] =>
  !ProductHelper.isProductBundle(entities[props.sku]) || !entities[props.sku].bundledProducts
    ? []
    : entities[props.sku].bundledProducts
        .filter(({ sku }) => !!entities[sku])
        .map(({ sku, quantity }) => ({
          product: entities[sku],
          quantity,
        }))
);

export const getProductLinks = createSelector(
  getCategoryTree,
  getProductEntities,
  (categories, products, props: { sku: string }): ProductLinksView =>
    !products[props.sku] || !products[props.sku].links
      ? {}
      : Object.keys(products[props.sku].links).reduce((acc, val) => {
          const links: ProductLinks = products[props.sku].links;
          acc[val] = {
            products: () =>
              links[val].products.map(sku => createProductView(products[sku], categories)).filter(x => !!x),
            productSKUs: links[val].products || [],
            categories: () =>
              links[val].categories.map(uniqueId => createCategoryView(categories, uniqueId)).filter(x => !!x),
            categoryIds: links[val].categories || [],
          };
          return acc;
        }, {})
);

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
