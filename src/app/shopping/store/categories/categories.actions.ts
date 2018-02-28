import { Action } from '@ngrx/store';
import { Category } from '../../../models/category/category.model';

export enum CategoriesActionTypes {
  LoadTopLevelCategories = '[Shopping] Load top level categories',
  LoadTopLevelCategoriesFail = '[Shopping] Load top level categories fail',
  LoadTopLevelCategoriesSuccess = '[Shopping] Load top level categories success',
  LoadCategory = '[Shopping] Load Category',
  LoadCategoryFail = '[Shopping] Load Category Fail',
  LoadCategorySuccess = '[Shopping] Load Category Success',
  SaveSubCategories = '[Shopping] Save SubCategories',
  SetProductSkusForCategory = '[Shopping] Set Product SKUs For Category'
}

export class LoadTopLevelCategories implements Action {
  readonly type = CategoriesActionTypes.LoadTopLevelCategories;
  constructor(public payload: number) { }
}

export class LoadTopLevelCategoriesFail implements Action {
  readonly type = CategoriesActionTypes.LoadTopLevelCategoriesFail;
  constructor(public payload: any) { }
}

export class LoadTopLevelCategoriesSuccess implements Action {
  readonly type = CategoriesActionTypes.LoadTopLevelCategoriesSuccess;
  constructor(public payload: Category[]) { }
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
  | LoadTopLevelCategories
  | LoadTopLevelCategoriesFail
  | LoadTopLevelCategoriesSuccess
  | LoadCategory
  | LoadCategoryFail
  | LoadCategorySuccess
  | SaveSubCategories
  | SetProductSkusForCategory;
