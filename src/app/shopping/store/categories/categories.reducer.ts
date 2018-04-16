import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Category } from '../../../models/category/category.model';
import { adapterUpsertMany, adapterUpsertOne } from '../../../utils/adapter-upsert';
import { CategoriesAction, CategoriesActionTypes } from './categories.actions';

export interface CategoriesState extends EntityState<Category> {
  loading: boolean;
  topLevelCategoriesIds: string[];
  categoriesProductSKUs: { [uniqueId: string]: string[] };
  selected: string;
}

export const categoryAdapter: EntityAdapter<Category> = createEntityAdapter<Category>({
  selectId: category => category.uniqueId,
});

export const initialState: CategoriesState = categoryAdapter.getInitialState({
  loading: false,
  topLevelCategoriesIds: [],
  categoriesProductSKUs: {},
  selected: undefined,
});

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
      const loadedCategory = action.payload;

      const upsert = { id: loadedCategory.uniqueId, entity: loadedCategory };
      return {
        ...adapterUpsertOne(upsert, state, categoryAdapter),
        loading: false,
      };
    }

    case CategoriesActionTypes.SaveSubCategories: {
      const subCategories = action.payload;

      const upserts = subCategories.map(c => ({
        id: c.uniqueId,
        entity: c,
      }));

      return adapterUpsertMany(upserts, state, categoryAdapter);
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
      const tlCategories = action.payload;
      const topLevelCategoriesIds = tlCategories.map(c => c.uniqueId);

      const allCategories = tlCategories.map(c => flattenSubCategories(c)).reduce((acc, p) => [...acc, ...p], []);

      const upserts = allCategories.map(c => ({
        id: c.uniqueId,
        entity: c,
      }));

      return {
        ...adapterUpsertMany(upserts, state, categoryAdapter),
        topLevelCategoriesIds,
      };
    }
  }

  return state;
}

export function flattenSubCategories(c: Category): Category[] {
  if (!(c.hasOnlineSubCategories && c.subCategoriesCount > 0)) {
    return [c];
  }

  const category = {
    ...c,
    subCategoriesIds: c.subCategories.map(sc => sc.uniqueId),
  };
  delete category.subCategories;

  const categories = c.subCategories
    .map(sc => flattenSubCategories(sc))
    .reduce((acc, p) => [...acc, ...p], [])
    .filter(e => !!e);

  return [...categories, category];
}
