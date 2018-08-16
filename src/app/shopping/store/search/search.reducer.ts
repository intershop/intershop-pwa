import { SuggestTerm } from '../../../models/suggest-term/suggest-term.model';

import { SearchAction, SearchActionTypes } from './search.actions';

export interface SearchState {
  searchTerm: string;
  loading: boolean;
  suggestSearchResults: SuggestTerm[];
}

export const initialState: SearchState = {
  searchTerm: undefined,
  loading: false,
  suggestSearchResults: [],
};

export function searchReducer(state = initialState, action: SearchAction): SearchState {
  switch (action.type) {
    case SearchActionTypes.SearchProducts: {
      return {
        ...state,
        loading: true,
      };
    }

    case SearchActionTypes.SearchProductsSuccess: {
      return {
        ...state,
        searchTerm: action.payload,
        loading: false,
      };
    }

    case SearchActionTypes.SuggestSearchSuccess: {
      return {
        ...state,
        suggestSearchResults: action.payload,
      };
    }
  }

  return state;
}
