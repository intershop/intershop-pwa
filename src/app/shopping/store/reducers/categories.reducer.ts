import { Category } from '../../../models/category/category.model';
import * as fromCategories from '../actions/categories.actions';

export interface CategoriesState {
  entities: { [categoryUniqueId: string]: Category };
  loaded: boolean;
  loading: boolean;
}

export const initialState: CategoriesState = {
  entities: {},
  loaded: false,
  loading: false,
};

export function reducer(
  state = initialState,
  action: fromCategories.CategoryAction
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
      const loadedCategory = action.payload;
      const entities = {
        ...state.entities,
        [loadedCategory.uniqueId]: loadedCategory,
      };
      return {
        ...state,
        loading: false,
        loaded: true,
        entities
      };
    }

  }

  return state;
}

export const getCategoryEntities = (state: CategoriesState) => state.entities;
export const getCategoryLoading = (state: CategoriesState) => state.loading;
export const getCategoryLoaded = (state: CategoriesState) => state.loaded;
