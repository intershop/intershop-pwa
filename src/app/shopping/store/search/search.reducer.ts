import { SuggestTerm } from '../../../models/suggest-term/suggest-term.model';
import { SearchAction, SearchActionTypes } from './search.actions';

export interface SearchState {
  searchTerm: string;
  products: string[];
  loading: boolean;
  suggestSearchResults: SuggestTerm[];
}

export const initialState: SearchState = {
  searchTerm: undefined,
  products: [],
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
      const searchResult = action.payload;
      const products = searchResult.products;
      const searchTerm = searchResult.searchTerm;
      const loading = false;
      return {
        ...state,
        products,
        searchTerm,
        loading,
      };
    }

    case SearchActionTypes.SuggestSearchSuccess: {
      const suggestSearchResults = action.payload;
      return {
        ...state,
        suggestSearchResults,
      };
    }
  }

  return state;
}
