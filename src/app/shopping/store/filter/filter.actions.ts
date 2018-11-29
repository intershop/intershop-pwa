import { Action } from '@ngrx/store';

import { Category } from 'ish-core/models/category/category.model';
import { FilterNavigation } from 'ish-core/models/filter-navigation/filter-navigation.model';
import { HttpError } from 'ish-core/models/http-error/http-error.model';

export enum FilterActionTypes {
  LoadFilterForCategory = '[Shopping] Load Filter For Category',
  LoadFilterForCategorySuccess = '[Shopping] Load Filter For Category Success',
  LoadFilterForCategoryFail = '[Shopping] Load Filter For Category Fail',
  ApplyFilter = '[Shopping] Apply Filter',
  ApplyFilterSuccess = '[Shopping] Apply Filter Success',
  ApplyFilterFail = '[Shopping] Apply Filter Fail',
  LoadFilterForSearch = '[Shopping] Load Filter for Search',
  LoadFilterForSearchSuccess = '[Shopping] Load Filter for Search Success',
  LoadFilterForSearchFail = '[Shopping] Load Filter for Search Fail',
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
  constructor(public payload: HttpError) {}
}

export class LoadFilterForSearch implements Action {
  readonly type = FilterActionTypes.LoadFilterForSearch;
  constructor(public payload: string) {}
}

export class LoadFilterForSearchSuccess implements Action {
  readonly type = FilterActionTypes.LoadFilterForSearchSuccess;
  constructor(public payload: FilterNavigation) {}
}

export class LoadFilterForSearchFail implements Action {
  readonly type = FilterActionTypes.LoadFilterForSearchFail;
  constructor(public payload: HttpError) {}
}

export class ApplyFilter implements Action {
  readonly type = FilterActionTypes.ApplyFilter;
  constructor(public payload: { filterId: string; searchParameter: string }) {}
}

export class ApplyFilterSuccess implements Action {
  readonly type = FilterActionTypes.ApplyFilterSuccess;
  constructor(public payload: { availableFilter: FilterNavigation; filterName: string; searchParameter: string }) {}
}

export class ApplyFilterFail implements Action {
  readonly type = FilterActionTypes.ApplyFilterFail;
  constructor(public payload: HttpError) {}
}

export type FilterActions =
  | LoadFilterForCategory
  | LoadFilterForCategorySuccess
  | LoadFilterForCategoryFail
  | ApplyFilter
  | ApplyFilterSuccess
  | ApplyFilterFail
  | LoadFilterForSearch
  | LoadFilterForSearchSuccess
  | LoadFilterForSearchFail;
