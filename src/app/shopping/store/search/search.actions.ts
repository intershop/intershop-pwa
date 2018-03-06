import { Action } from '@ngrx/store';

export enum SearchActionTypes {
  DoSearch = '[Shopping] Do Search',
  SearchProductsAvailable = '[Shopping] Search Products Available',
  SearchProductFail = '[Shopping] Search Products Fail'
}

export class DoSearch implements Action {
  readonly type = SearchActionTypes.DoSearch;
  constructor(public payload: string) { }
}

export class SearchProductsAvailable implements Action {
  readonly type = SearchActionTypes.SearchProductsAvailable;
  constructor(public payload: string[]) { }
}

export class SearchProductFail implements Action {
  readonly type = SearchActionTypes.SearchProductFail;
  constructor(public payload: any) { }
}

export type SearchAction = DoSearch | SearchProductsAvailable | SearchProductFail;
