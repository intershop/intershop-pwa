import { Action } from '@ngrx/store';
import { ViewType } from '../../../models/viewtype/viewtype.types';

export enum ViewconfActionTypes {
  SetEndlessScrollingPageSize = '[Shopping Internal] Set Endless Scrolling Page Size',
  ChangeViewType = '[Shopping] Change ViewType Setting',
  ChangeSortBy = '[Shopping] Change SortBy Setting',
  SetSortKeys = '[Shopping] Set SortKey List',
  SetPagingLoading = '[Shopping] Set Paging Loading',
  SetPagingInfo = '[Shopping] Set Paging Info',
  SetPage = '[Shopping Internal] Set Page',
  DisableEndlessScrolling = '[Shopping Internal] Disable Endless Scrolling',
}

export class SetEndlessScrollingPageSize implements Action {
  readonly type = ViewconfActionTypes.SetEndlessScrollingPageSize;
  constructor(public payload: number) {}
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

export class SetPagingLoading implements Action {
  readonly type = ViewconfActionTypes.SetPagingLoading;
}

export class SetPage implements Action {
  readonly type = ViewconfActionTypes.SetPage;
  constructor(public payload: number) {}
}

export class DisableEndlessScrolling implements Action {
  readonly type = ViewconfActionTypes.DisableEndlessScrolling;
}

export type ViewconfAction =
  | SetEndlessScrollingPageSize
  | ChangeViewType
  | ChangeSortBy
  | SetSortKeys
  | SetPagingLoading
  | SetPagingInfo
  | SetPage
  | DisableEndlessScrolling;
