import { EntityState, createEntityAdapter } from '@ngrx/entity';

import { SuggestTerm } from 'ish-core/models/suggest-term/suggest-term.model';

import { SearchAction, SearchActionTypes } from './search.actions';

export interface SuggestSearch {
  suggestSearchTerm: string;
  suggestSearchResults: SuggestTerm[];
}

export const searchAdapter = createEntityAdapter<SuggestSearch>({
  selectId: search => search.suggestSearchTerm,
});

export interface SearchState extends EntityState<SuggestSearch> {
  searchTerm: string;
  suggestSearchTerm: string;
  suggestSearchResults: SuggestTerm[];
  currentSearchBoxId: string;
}

export const initialState: SearchState = searchAdapter.getInitialState({
  searchTerm: undefined,
  suggestSearchTerm: undefined,
  currentSearchBoxId: undefined,
  suggestSearchResults: [],
});

export function searchReducer(state = initialState, action: SearchAction): SearchState {
  switch (action.type) {
    case SearchActionTypes.SelectSearchTerm: {
      return {
        ...state,
        searchTerm: action.payload.searchTerm,
        suggestSearchTerm: action.payload.searchTerm,
      };
    }

    case SearchActionTypes.SuggestSearch: {
      return {
        ...state,
        suggestSearchTerm: action.payload.searchTerm,
        currentSearchBoxId: action.payload.id,
      };
    }

    case SearchActionTypes.SuggestSearchSuccess: {
      return searchAdapter.upsertOne(
        {
          suggestSearchTerm: action.payload.searchTerm,
          suggestSearchResults: action.payload.suggests,
        },
        {
          ...state,
          suggestSearchResults: action.payload.suggests,
        }
      );
    }
  }

  return state;
}
