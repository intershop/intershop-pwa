import { createSelector } from '@ngrx/store';
import * as fromRoot from '../../../core/store';
import { Category } from '../../../models/category/category.model';
import * as fromFeature from '../reducers';
import * as fromCategories from '../reducers/categories.reducer';

export const getCategoryState = createSelector(
  fromFeature.getShoppingState, (state: fromFeature.ShoppingState) => state.categories
);

export const getCategoryEntities = createSelector(
  getCategoryState,
  fromCategories.getCategoryEntities
);

export const getSelectedCategory = createSelector(
  getCategoryEntities,
  fromRoot.getRouterState,
  (entities, router): Category => {
    return router.state && entities[router.state.params.categoryUniqueId];
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
