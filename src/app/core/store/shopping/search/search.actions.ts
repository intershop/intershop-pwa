import { Action } from '@ngrx/store';

import { HttpError } from '../../../models/http-error/http-error.model';
import { SuggestTerm } from '../../../models/suggest-term/suggest-term.model';

export enum SearchActionTypes {
  SearchProducts = '[Shopping] Search Products',
  SearchProductsSuccess = '[Shopping] Search Products Success',
  SearchProductsFail = '[Shopping] Search Products Fail',
  SuggestSearch = '[Shopping] Suggest Search',
  SuggestSearchSuccess = '[Shopping] Suggest Search Success',
}

export class SearchProducts implements Action {
  readonly type = SearchActionTypes.SearchProducts;
  constructor(public payload: { searchTerm: string; page?: number; sorting?: string }) {}
}

export class SearchProductsSuccess implements Action {
  readonly type = SearchActionTypes.SearchProductsSuccess;
  constructor(public payload: { searchTerm: string }) {}
}

export class SearchProductsFail implements Action {
  readonly type = SearchActionTypes.SearchProductsFail;
  constructor(public payload: { error: HttpError }) {}
}

export class SuggestSearch implements Action {
  readonly type = SearchActionTypes.SuggestSearch;
  constructor(public payload: { searchTerm: string }) {}
}

export class SuggestSearchSuccess implements Action {
  readonly type = SearchActionTypes.SuggestSearchSuccess;
  constructor(public payload: { suggests: SuggestTerm[] }) {}
}

export type SearchAction =
  | SearchProducts
  | SearchProductsSuccess
  | SearchProductsFail
  | SuggestSearch
  | SuggestSearchSuccess;
