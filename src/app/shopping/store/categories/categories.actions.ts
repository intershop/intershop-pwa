import { Action } from '@ngrx/store';
import { CategoryTree } from '../../../models/category-tree/category-tree.model';
import { HttpError } from '../../../models/http-error/http-error.model';

export enum CategoriesActionTypes {
  SelectCategory = '[Shopping] Select Category',
  DeselectCategory = '[Shopping] Deselect Category',
  SelectedCategoryAvailable = '[Shopping] Selected Category Available',
  LoadTopLevelCategories = '[Shopping] Load top level categories',
  LoadTopLevelCategoriesFail = '[Shopping] Load top level categories fail',
  LoadTopLevelCategoriesSuccess = '[Shopping] Load top level categories success',
  LoadCategory = '[Shopping] Load Category',
  LoadCategoryFail = '[Shopping] Load Category Fail',
  LoadCategorySuccess = '[Shopping] Load Category Success',
}

export class SelectCategory implements Action {
  readonly type = CategoriesActionTypes.SelectCategory;
  constructor(public payload: string) {}
}

export class DeselectCategory implements Action {
  readonly type = CategoriesActionTypes.DeselectCategory;
  readonly payload = undefined;
}

export class SelectedCategoryAvailable implements Action {
  readonly type = CategoriesActionTypes.SelectedCategoryAvailable;
  constructor(public payload: string) {}
}

export class LoadTopLevelCategories implements Action {
  readonly type = CategoriesActionTypes.LoadTopLevelCategories;
  constructor(public payload: number) {}
}

export class LoadTopLevelCategoriesFail implements Action {
  readonly type = CategoriesActionTypes.LoadTopLevelCategoriesFail;
  constructor(public payload: HttpError) {}
}

export class LoadTopLevelCategoriesSuccess implements Action {
  readonly type = CategoriesActionTypes.LoadTopLevelCategoriesSuccess;
  constructor(public payload: CategoryTree) {}
}

export class LoadCategory implements Action {
  readonly type = CategoriesActionTypes.LoadCategory;
  constructor(public payload: string) {}
}

export class LoadCategoryFail implements Action {
  readonly type = CategoriesActionTypes.LoadCategoryFail;
  constructor(public payload: HttpError) {}
}

export class LoadCategorySuccess implements Action {
  readonly type = CategoriesActionTypes.LoadCategorySuccess;
  constructor(public payload: CategoryTree) {}
}

export type CategoriesAction =
  | SelectCategory
  | DeselectCategory
  | LoadTopLevelCategories
  | LoadTopLevelCategoriesFail
  | LoadTopLevelCategoriesSuccess
  | LoadCategory
  | LoadCategoryFail
  | LoadCategorySuccess;
