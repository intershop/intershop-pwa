import { SuggestTerm } from '../../../models/suggest-term/suggest-term.model';
import { SearchAction, SearchActionTypes } from './search.actions';

export interface SearchState {
  searchTerm: string;
  skus: string[];
  loading: boolean;
  suggestSearchResults: SuggestTerm[];
}

export const initialState: SearchState = {
  searchTerm: undefined,
  skus: [],
  loading: false,
  suggestSearchResults: [],
};

export function searchReducer(state = initialState, action: SearchAction): SearchState {
  switch (action.type) {
    case SearchActionTypes.DoSearch: {
      const searchTerm = action.payload;
      const loading = true;

      return { ...state, searchTerm, loading };
    }

    case SearchActionTypes.SearchProductsAvailable: {
      const skus = action.payload;
      const loading = false;

      return { ...state, skus, loading };
    }

    case SearchActionTypes.SuggestSearchSuccess: {
      const suggestSearchResults = action.payload;
      return { ...state, suggestSearchResults };
    }
  }

  return state;
}
