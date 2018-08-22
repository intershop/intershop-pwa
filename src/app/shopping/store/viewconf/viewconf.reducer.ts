import { ViewType } from '../../../models/viewtype/viewtype.types';
import { CategoriesAction, CategoriesActionTypes } from '../categories';
import { SearchAction, SearchActionTypes } from '../search';

import * as fromViewconf from './viewconf.actions';

export interface ViewconfState {
  viewType: ViewType;
  sortBy: string;
  sortKeys: string[];
  loading: boolean;
  products: string[];
  page: number;
  total: number;
  itemsPerPage: number;
  endlessScrollingEnabled: boolean;
}

export const initialState: ViewconfState = {
  viewType: 'grid',
  sortBy: '',
  sortKeys: [],
  loading: false,
  products: [],
  page: 0,
  total: -1,
  itemsPerPage: -1,
  endlessScrollingEnabled: true,
};

export function viewconfReducer(
  state = initialState,
  action: fromViewconf.ViewconfAction | CategoriesAction | SearchAction
): ViewconfState {
  switch (action.type) {
    case fromViewconf.ViewconfActionTypes.SetEndlessScrollingPageSize: {
      return {
        ...state,
        itemsPerPage: action.payload,
      };
    }

    case fromViewconf.ViewconfActionTypes.ChangeViewType: {
      const viewType = action.payload;
      return { ...state, viewType };
    }

    case fromViewconf.ViewconfActionTypes.ChangeSortBy: {
      const sortBy = action.payload;
      return { ...state, sortBy };
    }

    case fromViewconf.ViewconfActionTypes.SetSortKeys: {
      const sortKeys = action.payload;
      return {
        ...state,
        sortKeys: [...sortKeys],
      };
    }

    case fromViewconf.ViewconfActionTypes.SetPagingLoading: {
      return {
        ...state,
        loading: true,
      };
    }

    case fromViewconf.ViewconfActionTypes.SetPagingInfo: {
      const { totalItems: total, currentPage: page, newProducts } = action.payload;
      const products = page === 0 ? newProducts : [...state.products, ...newProducts];
      return {
        ...state,
        total,
        page,
        products,
        loading: false,
      };
    }

    case fromViewconf.ViewconfActionTypes.SetPage: {
      return {
        ...state,
        page: action.payload,
      };
    }

    case fromViewconf.ViewconfActionTypes.DisableEndlessScrolling: {
      return {
        ...state,
        endlessScrollingEnabled: false,
      };
    }

    case CategoriesActionTypes.SelectCategory:
    case SearchActionTypes.PrepareNewSearch: {
      const { products, total } = initialState;

      return {
        ...state,
        total,
        products,
        loading: true,
      };
    }
  }

  return state;
}
