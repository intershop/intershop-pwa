import { createReducer, on } from '@ngrx/store';

import { CategoryTree, CategoryTreeHelper } from 'ish-core/models/category-tree/category-tree.model';
import { setLoadingOn } from 'ish-core/utils/ngrx-creators';

import {
  loadCategory,
  loadCategoryFail,
  loadCategorySuccess,
  loadTopLevelCategoriesSuccess,
} from './categories.actions';

export interface CategoriesState {
  categories: CategoryTree;
  loading: boolean;
}

export const initialState: CategoriesState = {
  loading: false,
  categories: CategoryTreeHelper.empty(),
};

function mergeCategories(
  state: CategoriesState,
  action: ReturnType<typeof loadTopLevelCategoriesSuccess | typeof loadCategorySuccess>
) {
  const loadedTree = action.payload.categories;
  const categories = CategoryTreeHelper.merge(state.categories, loadedTree);
  return {
    ...state,
    categories,
    loading: false,
  };
}

export const categoriesReducer = createReducer(
  initialState,
  setLoadingOn(loadCategory),
  on(loadCategoryFail, (state: CategoriesState) => ({
    ...state,
    loading: false,
  })),
  on(loadCategorySuccess, loadTopLevelCategoriesSuccess, mergeCategories)
);
