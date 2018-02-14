import { Action } from '@ngrx/store';
import { Category } from '../../../models/category/category.model';

export enum CategoriesActionTypes {
  LOAD_CATEGORY = '[Shopping] Load Category',
  LOAD_CATEGORY_FAIL = '[Shopping] Load Category Fail',
  LOAD_CATEGORY_SUCCESS = '[Shopping] Load Category Success',
  SAVE_SUBCATEGORIES = '[Shopping] Save SubCategories',
  SET_PRODUCT_SKUS_FOR_CATEGORY = '[Shopping] Set product skus For Category'
}

export class LoadCategory implements Action {
  readonly type = CategoriesActionTypes.LOAD_CATEGORY;
  constructor(public payload: string) { }
}

export class LoadCategoryFail implements Action {
  readonly type = CategoriesActionTypes.LOAD_CATEGORY_FAIL;
  constructor(public payload: any) { }
}

export class LoadCategorySuccess implements Action {
  readonly type = CategoriesActionTypes.LOAD_CATEGORY_SUCCESS;
  constructor(public payload: Category) { }
}

export class SaveSubCategories implements Action {
  readonly type = CategoriesActionTypes.SAVE_SUBCATEGORIES;
  constructor(public payload: Category[]) { }
}

export class SetProductSkusForCategory implements Action {
  readonly type = CategoriesActionTypes.SET_PRODUCT_SKUS_FOR_CATEGORY;
  constructor(public categoryUniqueId: string, public payload: string[]) { }
}

export type CategoryAction =
  LoadCategory |
  LoadCategoryFail |
  LoadCategorySuccess |
  SaveSubCategories |
  SetProductSkusForCategory;
