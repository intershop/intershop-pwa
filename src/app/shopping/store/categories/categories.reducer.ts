import { createEntityAdapter, EntityAdapter, EntityState, Update } from '@ngrx/entity';
import { Category } from '../../../models/category/category.model';
import { CategoriesActionTypes, CategoryAction } from './categories.actions';

export interface CategoriesState extends EntityState<Category> {
  loading: boolean;
}

export const categoryAdapter: EntityAdapter<Category> = createEntityAdapter<Category>({
  selectId: category => category.uniqueId
});

export const initialState: CategoriesState = categoryAdapter.getInitialState({
  loading: false,
});

export function reducer(
  state = initialState,
  action: CategoryAction
): CategoriesState {
  switch (action.type) {

    case CategoriesActionTypes.LOAD_CATEGORY: {
      return {
        ...state,
        loading: true
      };
    }

    case CategoriesActionTypes.LOAD_CATEGORY_FAIL: {
      return {
        ...state,
        loading: false
      };
    }

    case CategoriesActionTypes.LOAD_CATEGORY_SUCCESS: {
      const loadedCategory = action.payload;
      const upsert: Update<Category> = { id: loadedCategory.uniqueId, changes: loadedCategory };

      return {
        ...categoryAdapter.upsertOne(upsert, state),
        loading: false
      };
    }

    case CategoriesActionTypes.SAVE_SUBCATEGORIES: {
      const subCategories = action.payload;
      const upserts: Update<Category>[] = subCategories.map(c => ({ id: c.uniqueId, changes: c }));
      return categoryAdapter.upsertMany(upserts, state);
    }

    case CategoriesActionTypes.SET_PRODUCT_SKUS_FOR_CATEGORY: {
      const skus = action.payload;
      const categoryUniqueId = action.categoryUniqueId;

      const update: Update<Category> = {
        id: categoryUniqueId,
        changes: {
          productSkus: skus
        }
      };

      return categoryAdapter.updateOne(update, state);
    }
  }

  return state;
}
