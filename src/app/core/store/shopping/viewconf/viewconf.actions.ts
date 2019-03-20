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
  AppendProducts = '[Shopping Internal] Append Products',
  DisableEndlessScrolling = '[Shopping Internal] Disable Endless Scrolling',
  ReplaceVariationProduct = '[Shopping Internal] Replace Variation Product',
}

export class SetEndlessScrollingPageSize implements Action {
  readonly type = ViewconfActionTypes.SetEndlessScrollingPageSize;
  constructor(public payload: { itemsPerPage: number }) {}
}

export class ChangeViewType implements Action {
  readonly type = ViewconfActionTypes.ChangeViewType;
  constructor(public payload: { viewType: ViewType }) {}
}

export class ChangeSortBy implements Action {
  readonly type = ViewconfActionTypes.ChangeSortBy;
  constructor(public payload: { sorting: string }) {}
}

export class SetSortKeys implements Action {
  readonly type = ViewconfActionTypes.SetSortKeys;
  constructor(public payload: { sortKeys: string[] }) {}
}

export class SetPagingInfo implements Action {
  readonly type = ViewconfActionTypes.SetPagingInfo;
  constructor(public payload: { totalItems: number; currentPage: number; newProducts: string[] }) {}
}

export class SetPagingLoading implements Action {
  readonly type = ViewconfActionTypes.SetPagingLoading;
}

export class SetPage implements Action {
  readonly type = ViewconfActionTypes.SetPage;
  constructor(public payload: { pageNumber: number }) {}
}

export class DisableEndlessScrolling implements Action {
  readonly type = ViewconfActionTypes.DisableEndlessScrolling;
}

export class ReplaceVariationProduct implements Action {
  readonly type = ViewconfActionTypes.ReplaceVariationProduct;
  constructor(public payload: { oldSku: string; newSku: string }) {}
}

export type ViewconfAction =
  | SetEndlessScrollingPageSize
  | ChangeViewType
  | ChangeSortBy
  | SetSortKeys
  | SetPagingLoading
  | SetPagingInfo
  | SetPage
  | DisableEndlessScrolling
  | ReplaceVariationProduct;
