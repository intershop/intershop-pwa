import { createSelector } from '@ngrx/store';
import * as fromRouter from '../../../core/store/router';
import { Category } from '../../../models/category/category.model';
import * as fromFeature from '../reducers';
import * as fromCategories from '../reducers/categories.reducer';

export const getCategoryState = createSelector(
  fromFeature.getShoppingState, (state: fromFeature.ShoppingState) => state.categories
);

export const {
  selectEntities: getCategoryEntities,
  selectAll: getCategories,
} = fromCategories.categoryAdapter.getSelectors(getCategoryState);


export const getSelectedCategoryId = createSelector(
  fromRouter.getRouterState,
  router => router.state && router.state.params.categoryUniqueId
);

export const getSelectedCategory = createSelector(
  getCategoryEntities,
  getSelectedCategoryId,
  (entities, id): Category => entities[id]
);

export const getSelectedCategoryPath = createSelector(
  getCategoryEntities,
  fromRouter.getRouterState,
  (entities, router): Category[] => {
    const categories: Category[] = [];
    const categoryUniqueId = router.state.params.categoryUniqueId;
    if (categoryUniqueId) {
      let categoryPathId = '';
      for (const categoryId of categoryUniqueId.split('.')) {
        categoryPathId = categoryPathId + categoryId;
        if (entities[categoryPathId]) {
          categories.push(entities[categoryPathId]);
        }
        categoryPathId = categoryPathId + '.';
      }
    }
    return categories;
  }
);

export const getCategoryLoaded = createSelector(
  getCategoryState,
  fromCategories.getCategoryLoaded
);

export const getCategoryLoading = createSelector(
  getCategoryState,
  fromCategories.getCategoryLoading
);





