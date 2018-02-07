import { Action } from '@ngrx/store';
import { Category } from '../../../models/category/category.model';

// load category
export const LOAD_CATEGORY = '[Shopping] Load Category';
export const LOAD_CATEGORY_FAIL = '[Shopping] Load Category Fail';
export const LOAD_CATEGORY_SUCCESS = '[Shopping] Load Category Success';
export const SAVE_SUBCATEGORIES = '[Shopping] Save SubCategories';

export class LoadCategory implements Action {
  readonly type = LOAD_CATEGORY;
  constructor(public payload: string) { }
}

export class LoadCategoryFail implements Action {
  readonly type = LOAD_CATEGORY_FAIL;
  constructor(public payload: any) { }
}

export class LoadCategorySuccess implements Action {
  readonly type = LOAD_CATEGORY_SUCCESS;
  constructor(public payload: Category) { }
}

export class SaveSubCategories implements Action {
  readonly type = SAVE_SUBCATEGORIES;
  constructor(public payload: Category[]) { }
}

export type CategoryAction =
  LoadCategory |
  LoadCategoryFail |
  LoadCategorySuccess |
  SaveSubCategories;
