import { createSelector } from '@ngrx/store';
import * as fromRouter from '../../../core/store/router';
import { Category, CategoryHelper } from '../../../models/category/category.model';
import * as productsSelectors from '../products/products.selectors';
import { getShoppingState, ShoppingState } from '../shopping.state';
import { categoryAdapter } from './categories.reducer';

const getCategoryState = createSelector(getShoppingState, (state: ShoppingState) => state.categories);

export const { selectEntities: getCategoryEntities, selectAll: getCategories } = categoryAdapter.getSelectors(
  getCategoryState
);

export const getSelectedCategoryId = createSelector(
  fromRouter.getRouterState,
  router => router && router.state && router.state.params.categoryUniqueId
);

export const getSelectedCategory = createSelector(
  getCategoryEntities,
  getSelectedCategoryId,
  (entities, id): Category => entities[id]
);

export const getSelectedCategoryPath = createSelector(
  getCategoryEntities,
  getSelectedCategoryId,
  (entities, categoryUniqueId): Category[] => {
    const categories: Category[] = [];
    if (categoryUniqueId) {
      CategoryHelper.getCategoryPathUniqueIds(categoryUniqueId).forEach(uniqueId => {
        categories.push(entities[uniqueId]);
      });
    }
    return categories;
  }
);

export const getCategoriesProductSKUs = createSelector(getCategoryState, state => state.categoriesProductSKUs);

export const getProductSKUsForSelectedCategory = createSelector(
  getCategoriesProductSKUs,
  getSelectedCategoryId,
  (categoriesProductSKUs, uniqueId) => categoriesProductSKUs[uniqueId] || []
);

export const getProductsForSelectedCategory = createSelector(
  getSelectedCategory,
  getProductSKUsForSelectedCategory,
  productsSelectors.getProductEntities,
  (category, skus, products) => (category && skus && skus.map(sku => products[sku])) || []
);

export const getProductCountForSelectedCategory = createSelector(
  getProductSKUsForSelectedCategory,
  skus => (skus && skus.length) || 0
);

export const getSelectedCategoryProductsNeeded = createSelector(
  getSelectedCategory,
  productsSelectors.getSelectedProductId,
  getProductSKUsForSelectedCategory,
  (c, selectedProductSku, skus) => {
    if (!selectedProductSku && c && c.hasOnlineProducts && !skus.length) {
      return [c, selectedProductSku, skus];
    }
  }
);

export const getCategoryLoading = createSelector(getCategoryState, categories => categories.loading);

export const getTlCategoriesIds = createSelector(getCategoryState, categories => categories.topLevelCategoriesIds);

export const getTopLevelCategories = createSelector(
  getCategoryEntities,
  getTlCategoriesIds,
  (entities, tlCategoriesIds) => {
    return tlCategoriesIds.map(id => entities[id]).map(category => populateSubCategories(category, entities));
  }
);

function populateSubCategories(c: Category, entities): Category {
  if (!(c.hasOnlineSubCategories && c.subCategoriesIds && c.subCategoriesIds.length && c.subCategoriesCount > 0)) {
    return c;
  }

  const subCategories = c.subCategoriesIds.map(id => entities[id]).map(cc => populateSubCategories(cc, entities));

  return { ...c, subCategories };
}
