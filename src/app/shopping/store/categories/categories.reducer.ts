import { CategoryTree, CategoryTreeHelper } from '../../../models/category-tree/category-tree.model';
import { CategoriesAction, CategoriesActionTypes } from './categories.actions';

export interface CategoriesState {
  categories: CategoryTree;
  loading: boolean;
  categoriesProductSKUs: { [uniqueId: string]: string[] };
  selected: string;
}

export const initialState: CategoriesState = {
  loading: false,
  categories: CategoryTreeHelper.empty(),
  categoriesProductSKUs: {},
  selected: undefined,
};

export function categoriesReducer(state = initialState, action: CategoriesAction): CategoriesState {
  switch (action.type) {
    case CategoriesActionTypes.SelectCategory: {
      return {
        ...state,
        selected: action.payload,
      };
    }

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

    case CategoriesActionTypes.LoadCategorySuccess: {
      const loadedTree = action.payload;
      const categories = CategoryTreeHelper.merge(state.categories, loadedTree);
      return {
        ...state,
        categories,
        loading: false,
      };
    }

    case CategoriesActionTypes.SetProductSkusForCategory: {
      const skus = action.payload;
      const categoryUniqueId = action.categoryUniqueId;

      const categoriesProductSKUs = {
        ...state.categoriesProductSKUs,
        [categoryUniqueId]: skus,
      };

      return { ...state, categoriesProductSKUs };
    }

    case CategoriesActionTypes.LoadTopLevelCategoriesSuccess: {
      const loadedTree = action.payload;
      // merge the current tree onto the incoming to respect the sorting order from ICM
      const categories = CategoryTreeHelper.merge(loadedTree, state.categories);
      return {
        ...state,
        categories,
        loading: false,
      };
    }
  }

  return state;
}
