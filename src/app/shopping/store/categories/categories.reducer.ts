import { CategoryTree, CategoryTreeHelper } from '../../../models/category-tree/category-tree.model';
import { ProductsAction, ProductsActionTypes } from '../products';
import { CategoriesAction, CategoriesActionTypes } from './categories.actions';

export interface CategoriesState {
  categories: CategoryTree;
  loading: boolean;
  currentProductSKUs: string[];
  selected: string;
}

export const initialState: CategoriesState = {
  loading: false,
  categories: CategoryTreeHelper.empty(),
  currentProductSKUs: [],
  selected: undefined,
};

function removeDuplicates(arr: string[]) {
  return arr.filter((value, index, array) => array.indexOf(value) === index);
}

export function categoriesReducer(state = initialState, action: CategoriesAction | ProductsAction): CategoriesState {
  switch (action.type) {
    case CategoriesActionTypes.DeselectCategory:
    case CategoriesActionTypes.SelectCategory: {
      return {
        ...state,
        selected: action.payload,
        currentProductSKUs: initialState.currentProductSKUs,
      };
    }

    case CategoriesActionTypes.LoadCategory:
    case ProductsActionTypes.LoadProductsForCategory:
    case ProductsActionTypes.LoadMoreProductsForCategory: {
      return {
        ...state,
        loading: true,
      };
    }

    case CategoriesActionTypes.LoadCategoryFail:
    case ProductsActionTypes.LoadProductsForCategoryAbort: {
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
      const { skus } = action.payload;

      const currentProductSKUs = removeDuplicates([...state.currentProductSKUs, ...skus]);

      return { ...state, loading: false, currentProductSKUs };
    }
  }

  return state;
}
