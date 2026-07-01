import { createReducer, on } from '@ngrx/store';

import { designViewActions } from './design-view.actions';

export interface DesignViewState {
  selectedPageletId: string;
  previewedPageletId: string;
  scrollToPageletId: string;
}

const initialState: DesignViewState = {
  selectedPageletId: undefined,
  previewedPageletId: undefined,
  scrollToPageletId: undefined,
};

export const designViewReducer = createReducer(
  initialState,

  on(designViewActions.selectPagelet, (state, action): DesignViewState => ({
    ...state,
    selectedPageletId: action.payload.pageletId,
  })),

  on(designViewActions.previewPagelet, (state, action): DesignViewState => ({
    ...state,
    previewedPageletId: action.payload.pageletId,
  })),

  on(designViewActions.scrollToPagelet, (state, action): DesignViewState => ({
    ...state,
    scrollToPageletId: action.payload.pageletId,
  }))
);
