import { SuggestTerm } from '../../../models/suggest-term/suggest-term.model';

import { SearchAction, SearchActionTypes } from './search.actions';

export interface SearchState {
  searchTerm: string;
  suggestSearchResults: SuggestTerm[];
}

export const initialState: SearchState = {
  searchTerm: undefined,
  suggestSearchResults: [],
};

export function searchReducer(state = initialState, action: SearchAction): SearchState {
  switch (action.type) {
    case SearchActionTypes.SelectSearchTerm: {
      return {
        ...state,
        searchTerm: action.payload.searchTerm,
      };
    }

    case SearchActionTypes.SuggestSearchSuccess: {
      return {
        ...state,
        suggestSearchResults: action.payload.suggests,
      };
    }
  }

  return state;
}
