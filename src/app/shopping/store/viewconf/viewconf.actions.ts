import { Action } from '@ngrx/store';
import { ViewType } from '../../../models/types';

export enum ViewconfActionTypes {
  ChangeViewType = '[Shopping] Change ViewType Setting',
  ChangeSortBy = '[Shopping] Change SortBy Setting',
  SetSortKeys = '[Shopping] Set SortKey List',
}

export class ChangeViewType implements Action {
  readonly type = ViewconfActionTypes.ChangeViewType;
  constructor(public payload: ViewType) { }
}

export class ChangeSortBy implements Action {
  readonly type = ViewconfActionTypes.ChangeSortBy;
  constructor(public payload: string) { }
}

export class SetSortKeys implements Action {
  readonly type = ViewconfActionTypes.SetSortKeys;
  constructor(public payload: string[]) { }
}

export type ViewconfAction =
  | ChangeViewType
  | ChangeSortBy
  | SetSortKeys;
