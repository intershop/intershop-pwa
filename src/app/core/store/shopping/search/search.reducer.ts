import { createReducer, on } from '@ngrx/store';

import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { Suggestion } from 'ish-core/models/suggestion/suggestion.model';
import { setErrorOn, setLoadingOn, unsetLoadingAndErrorOn } from 'ish-core/utils/ngrx-creators';

import { clearSuggestions, suggestSearch, suggestSearchFail, suggestSearchSuccess } from './search.actions';

export interface SuggestState {
  suggests: Suggestion;
  loading: boolean;
  error: HttpError;
}

const initialState: SuggestState = {
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
      suggests: action.payload.suggests,
    })
  )
);
