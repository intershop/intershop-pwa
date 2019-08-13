import { Action } from '@ngrx/store';

import { HttpError } from '../../../models/http-error/http-error.model';
import { SuggestTerm } from '../../../models/suggest-term/suggest-term.model';

export enum SearchActionTypes {
  SelectSearchTerm = '[Shopping] Set Search Term',
  SearchProducts = '[Shopping] Search Products',
  SearchProductsFail = '[Shopping] Search Products Fail',
  SuggestSearch = '[Shopping] Suggest Search',
  SuggestApiSearch = '[Shopping] Suggest Api Search',
  SuggestSearchSuccess = '[Shopping] Suggest Search Success',
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

export class SuggestApiSearch implements Action {
  readonly type = SearchActionTypes.SuggestApiSearch;
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
  | SuggestSearchSuccess;
