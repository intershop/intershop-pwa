import { CategoryTree, CategoryTreeHelper } from 'ish-core/models/category-tree/category-tree.model';

import {
  CategoriesAction,
  CategoriesActionTypes,
  LoadCategorySuccess,
  LoadTopLevelCategoriesSuccess,
} from './categories.actions';

export interface CategoriesState {
  categories: CategoryTree;
  loading: boolean;
  topLevelLoaded: boolean;
}

export const initialState: CategoriesState = {
  loading: false,
  categories: CategoryTreeHelper.empty(),
  topLevelLoaded: false,
};

function mergeCategories(state: CategoriesState, action: LoadTopLevelCategoriesSuccess | LoadCategorySuccess) {
  const loadedTree = action.payload.categories;
  const categories = CategoryTreeHelper.merge(state.categories, loadedTree);
  return {
    ...state,
    categories,
    loading: false,
  };
}

export function categoriesReducer(state = initialState, action: CategoriesAction): CategoriesState {
  switch (action.type) {
    case CategoriesActionTypes.LoadCategory: {
      return {
        ...state,
        loading: true,
      };
    }

    case CategoriesActionTypes.LoadCategoryFail: {
      return {
        ...state,
        loading: false,
      };
    }

    case CategoriesActionTypes.LoadTopLevelCategoriesSuccess: {
      return { ...mergeCategories(state, action), topLevelLoaded: true };
    }

    case CategoriesActionTypes.LoadCategorySuccess: {
      return mergeCategories(state, action);
    }
  }

  return state;
}
