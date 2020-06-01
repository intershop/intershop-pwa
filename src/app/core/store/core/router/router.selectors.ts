import { RouterReducerState } from '@ngrx/router-store';
import { createSelector } from '@ngrx/store';

import { RouterState } from './router.reducer';

// tslint:disable-next-line: no-any
export const selectRouter: (state: any) => RouterReducerState<RouterState> = state => state.router;

export const selectRouteData = <T>(key: string) =>
  createSelector(selectRouter, (state): T => state?.state?.data && state.state.data[key]);

export const selectQueryParams = createSelector(selectRouter, state => state?.state?.queryParams || {});

export const selectQueryParam = (key: string) =>
  createSelector(selectQueryParams, (queryParams): string => queryParams && queryParams[key]);

export const selectRouteParam = (key: string) =>
  createSelector(selectRouter, (state): string => state?.state?.params && state.state.params[key]);

export const selectUrl = createSelector(selectRouter, state => state?.state?.url);
