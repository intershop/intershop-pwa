import { Action } from '@ngrx/store';
import { Category } from '../../../models/category/category.model';

export enum CategoriesActionTypes {
  LoadCategory = '[Shopping] Load Category',
  LoadCategoryFail = '[Shopping] Load Category Fail',
  LoadCategorySuccess = '[Shopping] Load Category Success',
  SaveSubCategories = '[Shopping] Save SubCategories',
  SetProductSkusForCategory = '[Shopping] Set Product SKUs For Category'
}

export class LoadCategory implements Action {
  readonly type = CategoriesActionTypes.LoadCategory;
  constructor(public payload: string) { }
}

export class LoadCategoryFail implements Action {
  readonly type = CategoriesActionTypes.LoadCategoryFail;
  constructor(public payload: any) { }
}

export class LoadCategorySuccess implements Action {
  readonly type = CategoriesActionTypes.LoadCategorySuccess;
  constructor(public payload: Category) { }
}

export class SaveSubCategories implements Action {
  readonly type = CategoriesActionTypes.SaveSubCategories;
  constructor(public payload: Category[]) { }
}

export class SetProductSkusForCategory implements Action {
  readonly type = CategoriesActionTypes.SetProductSkusForCategory;
  constructor(public categoryUniqueId: string, public payload: string[]) { }
}

export type CategoriesAction =
  LoadCategory |
  LoadCategoryFail |
  LoadCategorySuccess |
  SaveSubCategories |
  SetProductSkusForCategory;
