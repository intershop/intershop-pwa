import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';

import { SuggestTerm } from 'ish-core/models/suggest-term/suggest-term.model';

import { suggestSearchSuccess } from './search.actions';

interface SuggestSearch {
  searchTerm: string;
  suggests: SuggestTerm[];
}

export const searchAdapter = createEntityAdapter<SuggestSearch>({
  selectId: search => search.searchTerm,
});

export interface SearchState extends EntityState<SuggestSearch> {}

const initialState: SearchState = searchAdapter.getInitialState({});

export const searchReducer = createReducer(
  initialState,
  on(suggestSearchSuccess, (state, action) => searchAdapter.upsertOne(action.payload, state))
);
