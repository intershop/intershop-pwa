import { SuggestTerm } from '../../../models/suggest-term/suggest-term.model';
import { SearchAction, SearchActionTypes } from './search.actions';

export interface SearchState {
  searchTerm: string;
  skus: string[];
  searchLoading: boolean;
  suggestSearchResults: SuggestTerm[];
}

export const initialState: SearchState = {
  searchTerm: undefined,
  skus: [],
  searchLoading: false,
  suggestSearchResults: [],
};

export function searchReducer(
  state = initialState,
  action: SearchAction
): SearchState {
  switch (action.type) {

    case SearchActionTypes.DoSearch: {
      const searchTerm = action.payload;
      const searchLoading = true;

      return { ...state, searchTerm, searchLoading };
    }

    case SearchActionTypes.SearchProductsAvailable: {
      const skus = action.payload;
      const searchLoading = false;

      return { ...state, skus, searchLoading };
    }

    case SearchActionTypes.SuggestSearchSuccess: {
      const suggestSearchResults = action.payload;
      return { ...state, suggestSearchResults };
    }

  }

  return state;
}
