import { EntityState, createEntityAdapter } from '@ngrx/entity';

import { SuggestTerm } from '../../../models/suggest-term/suggest-term.model';

import { SearchAction, SearchActionTypes } from './search.actions';

export interface SuggestCacheType {
  term: string;
  suggestSearchResults: SuggestTerm[];
}

export const searchCacheAdapter = createEntityAdapter<SuggestCacheType>({
  selectId: search => search.term,
});

export interface SearchState extends EntityState<SuggestCacheType> {
  searchTerm: string;
  loading: boolean;
  currentSearchboxId: string;
  suggestSearchResults: SuggestTerm[];
}

export const initialState: SearchState = searchCacheAdapter.getInitialState({
  searchTerm: undefined,
  loading: false,
  currentSearchboxId: undefined,
  suggestSearchResults: [],
});

export function searchReducer(state = initialState, action: SearchAction): SearchState {
  switch (action.type) {
    case SearchActionTypes.SelectSearchTerm: {
      return {
        ...state,
        searchTerm: action.payload.searchTerm,
      };
    }

    case SearchActionTypes.SuggestSearch: {
      return {
        ...state,
        currentSearchboxId: action.payload.id,
      };
    }

    case SearchActionTypes.SuggestSearchSuccess: {
      return searchCacheAdapter.upsertOne(
        {
          term: action.payload.searchTerm,
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
