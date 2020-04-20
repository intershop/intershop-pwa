import { EntityState, createEntityAdapter } from '@ngrx/entity';

import { SuggestTerm } from 'ish-core/models/suggest-term/suggest-term.model';

import { SearchAction, SearchActionTypes } from './search.actions';

interface SuggestSearch {
  searchTerm: string;
  suggests: SuggestTerm[];
}

export const searchAdapter = createEntityAdapter<SuggestSearch>({
  selectId: search => search.searchTerm,
});

export interface SearchState extends EntityState<SuggestSearch> {}

const initialState: SearchState = searchAdapter.getInitialState({});

export function searchReducer(state = initialState, action: SearchAction): SearchState {
  switch (action.type) {
    case SearchActionTypes.SuggestSearchSuccess: {
      return searchAdapter.upsertOne(action.payload, state);
    }
  }

  return state;
}
