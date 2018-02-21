import { ViewType } from '../../../models/types';
import * as fromViewconf from './viewconf.actions';
import { ViewconfActionTypes } from './viewconf.actions';

export interface ViewconfState {
  sortBy: string;
  sortByOptions: any[]; // TODO type
  viewType: ViewType;
}

export const initialState: ViewconfState = {
  sortBy: '',
  sortByOptions: [],
  viewType: 'grid'
};

export function viewconfReducer(
  state = initialState,
  action: fromViewconf.CompareAction
): ViewconfState {
  switch (action.type) {

    case ViewconfActionTypes.ChangeViewType: {
      return state;
    }
  }

  return state;
}
