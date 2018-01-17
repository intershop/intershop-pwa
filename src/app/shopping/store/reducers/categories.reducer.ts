import { Category } from '../../../models/category/category.model';
import * as fromCategories from '../actions/categories.action';

export interface CategoriesState {
  data: Category;
  loaded: boolean;
  loading: boolean;
}

export const initialState: CategoriesState = {
  data: null,
  loaded: false,
  loading: false,
};

export function reducer(
  state = initialState,
  action: fromCategories.CategoriesAction
): CategoriesState {
  switch (action.type) {
    case fromCategories.LOAD_CATEGORY: {
      return {
        ...state,
        loading: true
      };
    }

    case fromCategories.LOAD_CATEGORY_FAIL: {
      return {
        ...state,
        loading: false,
        loaded: false
      };
    }

    case fromCategories.LOAD_CATEGORY_SUCCESS: {
      const data = action.payload;
      return {
        ...state,
        loading: false,
        loaded: true,
        data
      };
    }

  }

  return state;
}

export const getCategoryLoading = (state: CategoriesState) => state.loading;
export const getCategoryLoaded = (state: CategoriesState) => state.loaded;
export const getCategory = (state: CategoriesState) => state.data;
