import { createReducer, on } from '@ngrx/store';

import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { Suggestion } from 'ish-core/models/suggestion/suggestion.model';
import { setErrorOn, setLoadingOn, unsetLoadingAndErrorOn } from 'ish-core/utils/ngrx-creators';

import { clearSuggestions, suggestSearch, suggestSearchFail, suggestSearchSuccess } from './search.actions';

export interface SuggestState {
  searchTerm: string;
  suggests: Suggestion;
  loading: boolean;
  error: HttpError;
}

const initialState: SuggestState = {
  searchTerm: undefined,
  suggests: undefined,
  loading: false,
  error: undefined,
};

export const searchReducer = createReducer(
  initialState,
  setLoadingOn(suggestSearch),
  unsetLoadingAndErrorOn(suggestSearchSuccess),
  setErrorOn(suggestSearchFail),
  on(clearSuggestions, (): SuggestState => initialState),
  on(
    suggestSearchSuccess,
    (state, action): SuggestState => ({
      ...state,
      searchTerm: action.payload.searchTerm,
      suggests: action.payload.suggests,
    })
  )
);
