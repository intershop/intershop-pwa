import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';

import { Suggestion } from 'ish-core/models/suggestion/suggestion.model';

import { suggestSearchSuccess } from './search.actions';

interface SuggestSearch {
  searchTerm: string;
  suggests: Suggestion;
}

export const searchAdapter = createEntityAdapter<SuggestSearch>({
  selectId: search => search.searchTerm,
});

export type SearchState = EntityState<SuggestSearch>;

const initialState: SearchState = searchAdapter.getInitialState({});

export const searchReducer = createReducer(
  initialState,
  on(suggestSearchSuccess, (state, action) => searchAdapter.upsertOne(action.payload, state))
);
