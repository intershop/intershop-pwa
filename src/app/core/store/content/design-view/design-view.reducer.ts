import { createReducer, on } from '@ngrx/store';

import { designViewActions } from './design-view.actions';

export interface DesignViewState {
  selectedPageletId: string;
}

const initialState: DesignViewState = {
  selectedPageletId: undefined,
};

export const designViewReducer = createReducer(
  initialState,

  on(
    designViewActions.selectPagelet,
    (state, action): DesignViewState => ({
      ...state,
      selectedPageletId: action.payload.pageletId,
    })
  )
);
