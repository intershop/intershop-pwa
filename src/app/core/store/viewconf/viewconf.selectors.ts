import { createSelector } from '@ngrx/store';

import { getCoreState } from 'ish-core/store/core-store';
import { selectRouteData } from 'ish-core/store/router';

import { initialState } from './viewconf.reducer';

const getViewconfState = createSelector(
  getCoreState,
  // window.resize events can happen before store is initialized
  state => state.viewconf || initialState
);

export const getWrapperClass = selectRouteData<string>('wrapperClass');
export const getHeaderType = selectRouteData<string>('headerType');
export const getBreadcrumbData = createSelector(
  getViewconfState,
  state => state.breadcrumbData
);
export const getDeviceType = createSelector(
  getViewconfState,
  state => state._deviceType
);
export const isStickyHeader = createSelector(
  getViewconfState,
  getHeaderType,
  (state, headerType) => state.stickyHeader && !headerType
);
