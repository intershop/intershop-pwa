import { createReducer, on } from '@ngrx/store';

import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { Suggestion } from 'ish-core/models/suggestion/suggestion.model';
import { setErrorOn, setLoadingOn, unsetLoadingAndErrorOn } from 'ish-core/utils/ngrx-creators';

import {
  addSearchTermToSuggestion,
  removeSuggestions,
  suggestSearch,
  suggestSearchFail,
  suggestSearchSuccess,
} from './search.actions';

export interface SuggestState {
  suggests: Suggestion;
  _searchTerms: string[];
  loading: boolean;
  error: HttpError;
}

const initialState: SuggestState = {
  suggests: undefined,
  _searchTerms: localStorage.getItem('_searchTerms') ? JSON.parse(localStorage.getItem('_searchTerms')) : [],
  loading: false,
  error: undefined,
};

export const searchReducer = createReducer(
  initialState,
  setLoadingOn(suggestSearch),
  unsetLoadingAndErrorOn(suggestSearchSuccess),
  setErrorOn(suggestSearchFail),
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
      : [action.payload.searchTerm, ...state._searchTerms].slice(0, 10);
    const newState = { ...state, _searchTerms: newSearchTerms };
    localStorage.setItem('_searchTerms', JSON.stringify(newState._searchTerms));
    return newState;
  })
);
