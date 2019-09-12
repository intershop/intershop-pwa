import { Action } from '@ngrx/store';

import { FilterNavigation } from 'ish-core/models/filter-navigation/filter-navigation.model';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { ProductListingID } from 'ish-core/models/product-listing/product-listing.model';

export enum FilterActionTypes {
  LoadFilterForCategory = '[Shopping] Load Filter For Category',
  LoadFilterForSearch = '[Shopping] Load Filter for Search',
  LoadFilterSuccess = '[Shopping] Load Filter Success',
  LoadFilterFail = '[Shopping] Load Filter Fail',
  ApplyFilter = '[Shopping] Apply Filter',
  ApplyFilterSuccess = '[Shopping] Apply Filter Success',
  ApplyFilterFail = '[Shopping] Apply Filter Fail',
  LoadProductsForFilter = '[Shopping] Load Products For Filter',
  LoadProductsForFilterFail = '[Shopping] Load Products For Filter Fail',
}

export class LoadFilterForCategory implements Action {
  readonly type = FilterActionTypes.LoadFilterForCategory;
  constructor(public payload: { uniqueId: string }) {}
}

export class LoadFilterSuccess implements Action {
  readonly type = FilterActionTypes.LoadFilterSuccess;
  constructor(public payload: { filterNavigation: FilterNavigation }) {}
}

export class LoadFilterFail implements Action {
  readonly type = FilterActionTypes.LoadFilterFail;
  constructor(public payload: { error: HttpError }) {}
}

export class LoadFilterForSearch implements Action {
  readonly type = FilterActionTypes.LoadFilterForSearch;
  constructor(public payload: { searchTerm: string }) {}
}

export class ApplyFilter implements Action {
  readonly type = FilterActionTypes.ApplyFilter;
  constructor(public payload: { searchParameter: string }) {}
}

export class ApplyFilterSuccess implements Action {
  readonly type = FilterActionTypes.ApplyFilterSuccess;
  constructor(public payload: { availableFilter: FilterNavigation; searchParameter: string }) {}
}

export class ApplyFilterFail implements Action {
  readonly type = FilterActionTypes.ApplyFilterFail;
  constructor(public payload: { error: HttpError }) {}
}

export class LoadProductsForFilter implements Action {
  readonly type = FilterActionTypes.LoadProductsForFilter;
  constructor(public payload: { id: ProductListingID; searchParameter: string }) {}
}

export class LoadProductsForFilterFail implements Action {
  readonly type = FilterActionTypes.LoadProductsForFilterFail;
  constructor(public payload: { error: HttpError }) {}
}

export type FilterActions =
  | LoadFilterForCategory
  | LoadFilterSuccess
  | LoadFilterFail
  | ApplyFilter
  | ApplyFilterSuccess
  | ApplyFilterFail
  | LoadFilterForSearch
  | LoadProductsForFilter
  | LoadProductsForFilterFail;
