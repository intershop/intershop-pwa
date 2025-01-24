import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';

import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { Suggestion } from 'ish-core/models/suggestion/suggestion.model';
import { setErrorOn, setLoadingOn, unsetLoadingAndErrorOn, unsetLoadingOn } from 'ish-core/utils/ngrx-creators';

import { suggestSearch, suggestSearchFail, suggestSearchSuccess } from './search.actions';

interface SuggestSearch {
  searchTerm: string;
  suggests: Suggestion;
}

export const searchAdapter = createEntityAdapter<SuggestSearch>({
  selectId: search => search.searchTerm,
});
export interface SearchState extends EntityState<SuggestSearch> {
  loading: boolean;
  error: HttpError;
}

const initialState: SearchState = searchAdapter.getInitialState({
  loading: false,
  error: undefined,
});

export const searchReducer = createReducer(
  initialState,
  setLoadingOn(suggestSearch),
  unsetLoadingOn(suggestSearchFail, suggestSearchSuccess),
  unsetLoadingAndErrorOn(suggestSearchSuccess),
  setErrorOn(suggestSearchFail),
  on(suggestSearchSuccess, (state, action) => searchAdapter.upsertOne(action.payload, state))
);
