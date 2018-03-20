import { ViewType } from '../../../models/viewtype/viewtype.types';
import * as fromViewconf from './viewconf.actions';

export interface ViewconfState {
  viewType: ViewType;
  sortBy: string;
  sortKeys: string[];
}

export const initialState: ViewconfState = {
  viewType: 'grid',
  sortBy: '',
  sortKeys: [],
};

export function viewconfReducer(
  state = initialState,
  action: fromViewconf.ViewconfAction
): ViewconfState {
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
        sortKeys: [...sortKeys]
      };
    }
  }

  return state;
}
