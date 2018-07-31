import { ViewType } from '../../../models/viewtype/viewtype.types';
import * as fromViewconf from './viewconf.actions';

export interface ViewconfState {
  viewType: ViewType;
  sortBy: string;
  sortKeys: string[];
  loading: boolean;
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
  page: 0,
  total: -1,
  itemsPerPage: -1,
  endlessScrollingEnabled: true,
};

export function viewconfReducer(state = initialState, action: fromViewconf.ViewconfAction): ViewconfState {
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
      return {
        ...state,
        total: action.payload.totalItems,
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
  }

  return state;
}
