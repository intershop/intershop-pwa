import { createSelector } from '@ngrx/store';

import { getCoreState } from '../core-store';

const getViewconfState = createSelector(
  getCoreState,
  state => state.viewconf
);

export const getWrapperClass = createSelector(
  getViewconfState,
  state => state.wrapperClass
);
export const getHeaderType = createSelector(
  getViewconfState,
  state => state.headerType
);
export const getBreadcrumbData = createSelector(
  getViewconfState,
  state => state.breadcrumbData
);
export const getDeviceType = createSelector(
  getViewconfState,
  state => state.deviceType
);
