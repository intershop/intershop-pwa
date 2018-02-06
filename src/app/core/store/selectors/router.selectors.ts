import { RouterReducerState } from '@ngrx/router-store';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromRouter from '../reducers/router.reducer';

export const getRouterState = createFeatureSelector<RouterReducerState<fromRouter.RouterStateUrl>>('routerReducer');

export const getRouterURL = createSelector(getRouterState, (router) => router.state.url);
