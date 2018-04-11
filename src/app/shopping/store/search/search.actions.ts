import { HttpErrorResponse } from '@angular/common/http';
import { Action } from '@ngrx/store';
import { SuggestTerm } from '../../../models/suggest-term/suggest-term.model';

export enum SearchActionTypes {
  DoSearch = '[Shopping] Do Search',
  DoSuggestSearch = '[Shopping] Do Suggest Search',
  SuggestSearchSuccess = '[Shopping] Suggest Search Success',
  SearchProductsAvailable = '[Shopping] Search Products Available',
  SearchProductFail = '[Shopping] Search Products Fail',
}

export class DoSearch implements Action {
  readonly type = SearchActionTypes.DoSearch;
  constructor(public payload: string) {}
}

export class DoSuggestSearch implements Action {
  readonly type = SearchActionTypes.DoSuggestSearch;
  constructor(public payload: string) {}
}

export class SuggestSearchSuccess implements Action {
  readonly type = SearchActionTypes.SuggestSearchSuccess;
  constructor(public payload: SuggestTerm[]) {}
}

export class SearchProductsAvailable implements Action {
  readonly type = SearchActionTypes.SearchProductsAvailable;
  constructor(public payload: string[]) {}
}

export class SearchProductFail implements Action {
  readonly type = SearchActionTypes.SearchProductFail;
  constructor(public payload: HttpErrorResponse) {}
}

export type SearchAction =
  | DoSearch
  | DoSuggestSearch
  | SuggestSearchSuccess
  | SearchProductsAvailable
  | SearchProductFail;
