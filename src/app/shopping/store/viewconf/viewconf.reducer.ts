import { ViewType } from '../../../models/viewtype/viewtype.types';
import * as fromViewconf from './viewconf.actions';

export interface ViewconfState {
  viewType: ViewType;
  sortBy: string;
  sortKeys: string[];
  page: number;
  total: number;
}

export const initialState: ViewconfState = {
  viewType: 'grid',
  sortBy: '',
  sortKeys: [],
  page: -1,
  total: -1,
};

export function viewconfReducer(state = initialState, action: fromViewconf.ViewconfAction): ViewconfState {
  switch (action.type) {
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

    case fromViewconf.ViewconfActionTypes.SetPagingInfo: {
      const page = action.payload.currentPage;
      const total = action.payload.totalItems;
      return {
        ...state,
        page,
        total,
      };
    }

    case fromViewconf.ViewconfActionTypes.ResetPagingInfo: {
      return {
        ...state,
        page: initialState.page,
        total: initialState.total,
      };
    }
  }

  return state;
}
