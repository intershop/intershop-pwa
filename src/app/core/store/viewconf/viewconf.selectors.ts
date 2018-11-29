import { createSelector } from '@ngrx/store';

import { CoreState } from '../core-store.module';

const getViewconfState = (state: CoreState) => state.viewconf;

export const getWrapperClass = createSelector(getViewconfState, state => state.wrapperClass);
export const getHeaderType = createSelector(getViewconfState, state => state.headerType);
export const getBreadcrumbData = createSelector(getViewconfState, state => state.breadcrumbData);
