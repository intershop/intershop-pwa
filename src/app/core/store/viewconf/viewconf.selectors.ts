import { createSelector } from '@ngrx/store';

import { getCoreState } from 'ish-core/store/core-store';
import { selectRouteData } from 'ish-core/store/router';

const getViewconfState = createSelector(
  getCoreState,
  state => state.viewconf
);

export const getWrapperClass = selectRouteData<string>('wrapperClass');
export const getHeaderType = selectRouteData<string>('headerType');
export const getBreadcrumbData = createSelector(
  getViewconfState,
  state => state.breadcrumbData
);
export const getDeviceType = createSelector(
  getViewconfState,
  state => state.deviceType
);
export const isStickyHeader = createSelector(
  getViewconfState,
  getHeaderType,
  (state, headerType) => state.stickyHeader && !headerType
);
