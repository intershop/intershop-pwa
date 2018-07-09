import { Action } from '@ngrx/store';
import { ViewType } from '../../../models/viewtype/viewtype.types';

export enum ViewconfActionTypes {
  ChangeViewType = '[Shopping] Change ViewType Setting',
  ChangeSortBy = '[Shopping] Change SortBy Setting',
  SetSortKeys = '[Shopping] Set SortKey List',
  SetPagingInfo = '[Shopping] Set Paging Info',
  ResetPagingInfo = '[Shopping] Reset Paging Info',
}

export class ChangeViewType implements Action {
  readonly type = ViewconfActionTypes.ChangeViewType;
  constructor(public payload: ViewType) {}
}

export class ChangeSortBy implements Action {
  readonly type = ViewconfActionTypes.ChangeSortBy;
  constructor(public payload: string) {}
}

export class SetSortKeys implements Action {
  readonly type = ViewconfActionTypes.SetSortKeys;
  constructor(public payload: string[]) {}
}

export class SetPagingInfo implements Action {
  readonly type = ViewconfActionTypes.SetPagingInfo;
  constructor(public payload: { totalItems: number; currentPage: number }) {}
}

export class ResetPagingInfo implements Action {
  readonly type = ViewconfActionTypes.ResetPagingInfo;
}

export type ViewconfAction = ChangeViewType | ChangeSortBy | SetSortKeys | SetPagingInfo | ResetPagingInfo;
