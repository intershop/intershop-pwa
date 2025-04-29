import { createReducer, on } from '@ngrx/store';

import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { Suggestions } from 'ish-core/models/suggestions/suggestions.model';
import { setErrorOn, setLoadingOn, unsetLoadingAndErrorOn } from 'ish-core/utils/ngrx-creators';

import {
  addSearchTermToSuggestion,
  removeSuggestions,
  sparqueSuggestServerError,
  suggestSearch,
  suggestSearchFail,
  suggestSearchSuccess,
} from './search.actions';

export interface SuggestState {
  suggests: Suggestions;
  _searchTerms: string[];
  loading: boolean;
  error: HttpError;
}

const initialState: SuggestState = {
  suggests: undefined,
  _searchTerms: SSR ? [] : localStorage.getItem('_searchTerms') ? JSON.parse(localStorage.getItem('_searchTerms')) : [],
  loading: false,
  error: undefined,
};

const MAX_NUMBER_OF_STORED_SEARCH_TERMS = 5;

export const searchReducer = createReducer(
  initialState,
  setLoadingOn(suggestSearch),
  unsetLoadingAndErrorOn(suggestSearchSuccess),
  setErrorOn(suggestSearchFail, sparqueSuggestServerError),
  on(removeSuggestions, (state): SuggestState => ({ ...state, suggests: undefined })),
  on(
    suggestSearchSuccess,
    (state, action): SuggestState => ({
      ...state,
      suggests: action.payload.suggests,
    })
  ),
  on(addSearchTermToSuggestion, (state, action): SuggestState => {
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
