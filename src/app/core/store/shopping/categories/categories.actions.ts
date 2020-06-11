import { createAction } from '@ngrx/store';

import { CategoryTree } from 'ish-core/models/category-tree/category-tree.model';
import { httpError, payload } from 'ish-core/utils/ngrx-creators';

export const loadTopLevelCategories = createAction(
  '[Shopping] Load top level categories',
  payload<{ depth: number }>()
);

export const loadTopLevelCategoriesFail = createAction('[Shopping] Load top level categories fail', httpError());

export const loadTopLevelCategoriesSuccess = createAction(
  '[Shopping] Load top level categories success',
  payload<{ categories: CategoryTree }>()
);

export const loadCategory = createAction('[Shopping] Load Category', payload<{ categoryId: string }>());

export const loadCategoryFail = createAction('[Shopping] Load Category Fail', httpError());

export const loadCategorySuccess = createAction(
  '[Shopping] Load Category Success',
  payload<{ categories: CategoryTree }>()
);
