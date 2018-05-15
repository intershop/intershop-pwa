import { HttpErrorResponse } from '@angular/common/http';
import { Action } from '@ngrx/store';
import { Category } from '../../../models/category/category.model';
import { FilterNavigation } from '../../../models/filter-navigation/filter-navigation.model';

export enum FilterActionTypes {
  LoadFilterForCategory = '[Shopping] Load Filter For Category',
  LoadFilterForCategorySuccess = '[Shopping] Load Filter For Category Success',
  LoadFilterForCategoryFail = '[Shopping] Load Filter For Category Fail',
  ApplyFilter = '[Shopping] Apply Filter',
  ApplyFilterSuccess = '[Shopping] Apply Filter Success',
  ApplyFilterFail = '[Shopping] Apply Filter Fail',
  SetFilteredProducts = '[Shopping] Set Filtered Products',
}

export class LoadFilterForCategory implements Action {
  readonly type = FilterActionTypes.LoadFilterForCategory;
  constructor(public payload: Category) {}
}

export class LoadFilterForCategorySuccess implements Action {
  readonly type = FilterActionTypes.LoadFilterForCategorySuccess;
  constructor(public payload: FilterNavigation) {}
}

export class LoadFilterForCategoryFail implements Action {
  readonly type = FilterActionTypes.LoadFilterForCategoryFail;
  constructor(public payload: HttpErrorResponse) {}
}

export class ApplyFilter implements Action {
  readonly type = FilterActionTypes.ApplyFilter;
  constructor(public payload: { filterId: string; searchParameter: string }) {}
}

export class ApplyFilterSuccess implements Action {
  readonly type = FilterActionTypes.ApplyFilterSuccess;
  constructor(public payload: FilterNavigation, public filterName: string, public searchParameter: string) {}
}

export class ApplyFilterFail implements Action {
  readonly type = FilterActionTypes.ApplyFilterFail;
  constructor(public payload: HttpErrorResponse) {}
}

export class SetFilteredProducts implements Action {
  readonly type = FilterActionTypes.SetFilteredProducts;
  constructor(public payload: string[]) {}
}
export type FilterActions =
  | LoadFilterForCategory
  | LoadFilterForCategorySuccess
  | LoadFilterForCategoryFail
  | ApplyFilter
  | ApplyFilterSuccess
  | ApplyFilterFail
  | SetFilteredProducts;
