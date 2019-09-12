import { Action } from '@ngrx/store';

import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { SuggestTerm } from 'ish-core/models/suggest-term/suggest-term.model';

export enum SearchActionTypes {
  SelectSearchTerm = '[Shopping] Set Search Term',
  SearchProducts = '[Shopping] Search Products',
  SearchProductsFail = '[Shopping] Search Products Fail',
  SuggestSearch = '[Suggest Search] Load Search Suggestions',
  SuggestSearchAPI = '[Suggest Search Internal] Trigger API Call for Search Suggestions',
  SuggestSearchSuccess = '[Suggest Search Internal] Return Search Suggestions',
}

export class SelectSearchTerm implements Action {
  readonly type = SearchActionTypes.SelectSearchTerm;
  constructor(public payload: { searchTerm: string }) {}
}

export class SearchProducts implements Action {
  readonly type = SearchActionTypes.SearchProducts;
  constructor(public payload: { searchTerm: string; page?: number; sorting?: string }) {}
}

export class SearchProductsFail implements Action {
  readonly type = SearchActionTypes.SearchProductsFail;
  constructor(public payload: { error: HttpError }) {}
}

export class SuggestSearch implements Action {
  readonly type = SearchActionTypes.SuggestSearch;
  constructor(public payload: { searchTerm: string; id: string }) {}
}

export class SuggestSearchAPI implements Action {
  readonly type = SearchActionTypes.SuggestSearchAPI;
  constructor(public payload: { searchTerm: string }) {}
}

export class SuggestSearchSuccess implements Action {
  readonly type = SearchActionTypes.SuggestSearchSuccess;
  constructor(public payload: { searchTerm: string; suggests: SuggestTerm[] }) {}
}

export type SearchAction =
  | SelectSearchTerm
  | SearchProducts
  | SearchProductsFail
  | SuggestSearch
  | SuggestSearchAPI
  | SuggestSearchSuccess;
