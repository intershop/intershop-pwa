import { FilterNavigation } from './../../../models/filter-navigation/filter-navigation.model';
import { HttpErrorResponse } from '@angular/common/http';
import { Action } from '@ngrx/store';

export enum FilterActionTypes {
  FilterProducts = '[Shopping] Filter Products',
  LoadFilterForCategory = '[Shopping] Load Filter For Category',
  LoadFilterForCategorySuccess = '[Shopping] Load Filter For Category Success',
}

export class FilterProducts implements Action {
  readonly type = FilterActionTypes.FilterProducts;
  constructor(public payload: string) {}
}

export class LoadFilterForCategory implements Action {
  readonly type = FilterActionTypes.LoadFilterForCategory;
  constructor(public payload: { parent: string; category: string }) {}
}

export class LoadFilterForCategorySuccess implements Action {
  readonly type = FilterActionTypes.LoadFilterForCategorySuccess;
  constructor(public payload: FilterNavigation) {}
}

export type FilterActions = FilterProducts | LoadFilterForCategory | LoadFilterForCategorySuccess;
