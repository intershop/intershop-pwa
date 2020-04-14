import { createAction } from '@ngrx/store';

import { CategoryTree } from 'ish-core/models/category-tree/category-tree.model';
import { httpError, payload } from 'ish-core/utils/ngrx-creators';

export const loadTopLevelCategories = createAction('[Categories Internal] Load top level categories');

export const loadTopLevelCategoriesFail = createAction('[Categories API] Load top level categories fail', httpError());

export const loadTopLevelCategoriesSuccess = createAction(
  '[Categories API] Load top level categories success',
  payload<{ categories: CategoryTree }>()
);

export const loadCategory = createAction('[Categories Internal] Load Category', payload<{ categoryId: string }>());

export const loadCategoryFail = createAction('[Categories API] Load Category Fail', httpError());

export const loadCategorySuccess = createAction(
  '[Categories API] Load Category Success',
  payload<{ categories: CategoryTree }>()
);
