import { createSelector } from '@ngrx/store';
import { Category, CategoryHelper } from '../../../models/category/category.model';
import { getProductEntities } from '../products';
import { getShoppingState, ShoppingState } from '../shopping.state';
import { categoryAdapter } from './categories.reducer';

const getCategoryState = createSelector(getShoppingState, (state: ShoppingState) => state.categories);

export const {
  selectEntities: getCategoryEntities,
  selectAll: getCategories,
  selectIds: getCategoriesIds,
} = categoryAdapter.getSelectors(getCategoryState);

/**
 * Retrieves the currently selected categoryUniqueId.
 * Be aware that it can have invalid values and it can change
 * so the referenced category might not yet be available
 *
 * When in doubt prefere using getSelectedCategory
 */
export const getSelectedCategoryId = createSelector(getCategoryState, state => state.selected);

/**
 * retrieves the currently resolved selected category
 */
export const getSelectedCategory = createSelector(
  getCategoryEntities,
  getSelectedCategoryId,
  (entities, id): Category => entities[id]
);

export const getSelectedCategoryPath = createSelector(
  getCategoryEntities,
  getSelectedCategory,
  (entities, category): Category[] => {
    const categories: Category[] = [];
    if (category) {
      CategoryHelper.getCategoryPathUniqueIds(category.uniqueId).forEach(uniqueId => {
        categories.push(entities[uniqueId]);
      });
    }
    return categories;
  }
);

export const getCategoriesProductSKUs = createSelector(getCategoryState, state => state.categoriesProductSKUs);

export const getProductSKUsForSelectedCategory = createSelector(
  getCategoriesProductSKUs,
  getSelectedCategory,
  (categoriesProductSKUs, category) => (!!category ? categoriesProductSKUs[category.uniqueId] || [] : [])
);

export const getProductsForSelectedCategory = createSelector(
  getSelectedCategory,
  getProductSKUsForSelectedCategory,
  getProductEntities,
  (category, skus, products) => (category && skus && skus.map(sku => products[sku])) || []
);

export const getProductCountForSelectedCategory = createSelector(
  getProductSKUsForSelectedCategory,
  skus => (skus && skus.length) || 0
);

export const productsForSelectedCategoryAreNotLoaded = createSelector(
  getSelectedCategory,
  getProductSKUsForSelectedCategory,
  (c, skus) => c && c.hasOnlineProducts && !skus.length
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
