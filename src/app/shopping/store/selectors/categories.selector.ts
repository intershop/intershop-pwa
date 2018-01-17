import { createSelector } from '@ngrx/store';
import * as fromFeature from '../reducers';
import * as fromCategories from '../reducers/categories.reducer';

export const getCategoryState = createSelector(fromFeature.getShoppingState, (state: fromFeature.ShoppingState) => state.categories);

export const getCategory = createSelector(getCategoryState, fromCategories.getCategory);
export const getCategoryLoaded = createSelector(getCategoryState, fromCategories.getCategoryLoaded);
export const getCategoryLoading = createSelector(getCategoryState, fromCategories.getCategoryLoading);
