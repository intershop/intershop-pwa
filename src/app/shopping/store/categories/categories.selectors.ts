import { createSelector } from '@ngrx/store';
import * as fromRouter from '../../../core/store/router';
import { Category } from '../../../models/category/category.model';
import * as productsSelectors from '../products/products.selectors';
import { getShoppingState, ShoppingState } from '../shopping.state';
import { categoryAdapter } from './categories.reducer';

const getCategoryState = createSelector(
  getShoppingState, (state: ShoppingState) => state.categories
);

export const {
  selectEntities: getCategoryEntities,
  selectAll: getCategories,
} = categoryAdapter.getSelectors(getCategoryState);

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
      categoryUniqueId = categoryUniqueId + '.';
      categoryUniqueId.split('.').reduce((acc, item) => {
        if (entities[acc]) {
          categories.push(entities[acc]);
        }
        return `${acc}.${item}`;
      });
    }
    return categories;
  }
);

export const getProductsForSelectedCategory = createSelector(
  getSelectedCategory,
  productsSelectors.getProductEntities,
  (category, products) => category && category.productSkus
    && category.productSkus.map(sku => products[sku]) || []
);

export const getProductCountForSelectedCategory = createSelector(
  getProductsForSelectedCategory,
  products => products && products.length || 0
);

export const getCategoryLoading = createSelector(
  getCategoryState,
  categories => categories.loading
);
