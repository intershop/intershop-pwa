import { createEntityAdapter, EntityAdapter, EntityState, Update } from '@ngrx/entity';
import { Category } from '../../../models/category/category.model';
import { CategoriesAction, CategoriesActionTypes } from './categories.actions';

export interface CategoriesState extends EntityState<Category> {
  loading: boolean;
}

export const categoryAdapter: EntityAdapter<Category> = createEntityAdapter<Category>({
  selectId: category => category.uniqueId
});

export const initialState: CategoriesState = categoryAdapter.getInitialState({
  loading: false,
});

export function categoriesReducer(
  state = initialState,
  action: CategoriesAction
): CategoriesState {
  switch (action.type) {

    case CategoriesActionTypes.LoadCategory: {
      return {
        ...state,
        loading: true
      };
    }

    case CategoriesActionTypes.LoadCategoryFail: {
      return {
        ...state,
        loading: false
      };
    }

    case CategoriesActionTypes.LoadCategorySuccess: {
      const loadedCategory = action.payload;

      /* WORKAROUND: upsert overrides the `id` property and doesn't work as expected
       * see https://github.com/ngrx/platform/issues/817
       * we will use remove and add until then
       * const upsert: Update<Category> = { id: loadedCategory.uniqueId, changes: loadedCategory };
       * ...categoryAdapter.upsertOne(upsert, state),
       */

      const cleanedState = categoryAdapter.removeOne(loadedCategory.uniqueId, state);

      return {
        ...categoryAdapter.addOne(loadedCategory, cleanedState),
        loading: false
      };

    }

    case CategoriesActionTypes.SaveSubCategories: {
      const subCategories = action.payload;

      /* WORKAROUND: upsert doen't work as expected
       * see https://github.com/ngrx/platform/issues/817
       * const upserts: Update<Category>[] = subCategories.map(c => ({ id: c.uniqueId, changes: c }));
       * return categoryAdapter.upsertMany(upserts, state);
       */

      return categoryAdapter.addMany(subCategories, state);
    }

    case CategoriesActionTypes.SetProductSkusForCategory: {
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
