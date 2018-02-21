import { ViewType } from '../../../models/types';
import * as fromViewconf from './viewconf.actions';
import { ViewconfActionTypes } from './viewconf.actions';

export interface ViewconfState {
  viewType: ViewType;
  sortBy: string;
  sortByOptions: any[]; // TODO type
}

export const initialState: ViewconfState = {
  viewType: 'grid',
  sortBy: 'default',
  sortByOptions: [],
};

export function viewconfReducer(
  state = initialState,
  action: fromViewconf.ViewconfAction
): ViewconfState {
  switch (action.type) {

    case ViewconfActionTypes.ChangeViewType: {
      const viewType = action.payload;
      return { ...state, viewType };
    }

    case ViewconfActionTypes.ChangeSortBy: {
      const sortBy = action.payload;
      return { ...state, sortBy };
    }
  }

  return state;
}
