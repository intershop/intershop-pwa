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
    case CategoriesActionTypes.DeselectCategory:
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

    case CategoriesActionTypes.LoadTopLevelCategoriesSuccess:
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
      const { skus, categoryUniqueId } = action.payload;

      const categoriesProductSKUs = {
        ...state.categoriesProductSKUs,
        [categoryUniqueId]: skus,
      };

      return { ...state, categoriesProductSKUs };
    }
  }

  return state;
}
