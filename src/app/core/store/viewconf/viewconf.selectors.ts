import { createSelector } from '@ngrx/store';
import { CoreState } from '../core.state';

const getViewconfState = (state: CoreState) => state.viewconf;

export const getWrapperClass = createSelector(getViewconfState, state => state.wrapperClass);
export const getHeaderType = createSelector(getViewconfState, state => state.headerType);
export const getBreadcrumbKey = createSelector(getViewconfState, state => state.breadcrumbKey);
