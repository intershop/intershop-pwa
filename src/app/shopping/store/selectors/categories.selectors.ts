import { createSelector } from '@ngrx/store';
import * as fromRouter from '../../../core/store/router';
import { Category } from '../../../models/category/category.model';
import * as fromFeature from '../reducers';
import * as fromCategories from '../reducers/categories.reducer';
import * as productsSelectors from './products.selectors';

export const getCategoryState = createSelector(
  fromFeature.getShoppingState, (state: fromFeature.ShoppingState) => state.categories
);

export const {
  selectEntities: getCategoryEntities,
  selectAll: getCategories,
} = fromCategories.categoryAdapter.getSelectors(getCategoryState);


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
      categoryUniqueId.split('.').reduce((acc, item) => {
        const nextPath = `${acc}.${item}`;
        if (entities[nextPath]) {
          categories.push(entities[nextPath]);
        }
        return nextPath;
      });
    }
    return categories;
  }
);


export const getProductsForSelectedCategory = createSelector(
  getSelectedCategory,
  productsSelectors.getProductEntities,
  (category, products) => category && category.productSkus
    && category.productSkus.map(sku => products[sku])
);

export const getProductCountForSelectedCategory = createSelector(
  getProductsForSelectedCategory,
  products => products && products.length
);

export const getCategoryLoading = createSelector(
  getCategoryState,
  categories => categories.loading
);





