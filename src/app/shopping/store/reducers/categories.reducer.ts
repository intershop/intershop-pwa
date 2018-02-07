import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Category } from '../../../models/category/category.model';
import * as fromCategories from '../actions/categories.actions';

export interface CategoriesState extends EntityState<Category> {
  loaded: boolean;
  loading: boolean;
}

export const categoryAdapter: EntityAdapter<Category> = createEntityAdapter<Category>({
  selectId: category => category.uniqueId
});

export const initialState: CategoriesState = categoryAdapter.getInitialState({
  loaded: false,
  loading: false,
});

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

      return {
        ...categoryAdapter.addOne(loadedCategory, state),
        loading: false,
        loaded: true,
      };
    }

    case fromCategories.SAVE_SUBCATEGORIES: {
      const subCategories = action.payload;
      return categoryAdapter.addMany(subCategories, state);
    }
  }

  return state;
}
