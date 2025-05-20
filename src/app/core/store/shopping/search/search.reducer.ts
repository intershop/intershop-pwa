import { createReducer, on } from '@ngrx/store';

import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { Suggestions } from 'ish-core/models/suggestions/suggestions.model';
import { setErrorOn, setLoadingOn, unsetLoadingAndErrorOn } from 'ish-core/utils/ngrx-creators';

import {
  addSearchTermToSuggestion,
  removeSuggestions,
  suggestSearch,
  suggestSearchFail,
  suggestSearchSuccess,
} from './search.actions';

export interface SearchState {
  suggestions: Suggestions;
  _searchTerms: string[];
  loading: boolean;
  error: HttpError;
}

const initialState: SearchState = {
  suggestions: undefined,
  _searchTerms: SSR ? [] : localStorage.getItem('_searchTerms') ? JSON.parse(localStorage.getItem('_searchTerms')) : [],
  loading: false,
  error: undefined,
};

const MAX_NUMBER_OF_STORED_SEARCH_TERMS = 5;

export const searchReducer = createReducer(
  initialState,
  setLoadingOn(suggestSearch),
  unsetLoadingAndErrorOn(suggestSearchSuccess),
  setErrorOn(suggestSearchFail),
  on(removeSuggestions, (state): SearchState => ({ ...state, suggestions: undefined })),
  on(
    suggestSearchSuccess,
    (state, action): SearchState => ({
      ...state,
      suggestions: action.payload.suggestions,
    })
  ),
  on(addSearchTermToSuggestion, (state, action): SearchState => {
    const newSearchTerms = state._searchTerms.includes(action.payload.searchTerm)
      ? [...state._searchTerms]
      : [action.payload.searchTerm, ...state._searchTerms].slice(0, MAX_NUMBER_OF_STORED_SEARCH_TERMS);
    const newState = { ...state, _searchTerms: newSearchTerms };
    if (!SSR) {
      localStorage.setItem('_searchTerms', JSON.stringify(newState._searchTerms));
    }

    return newState;
  })
);
