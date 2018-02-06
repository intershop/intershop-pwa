import { RouterReducerState } from '@ngrx/router-store';
import { createFeatureSelector } from '@ngrx/store';
import * as fromRouter from '../reducers/router.reducer';

export const getRouterState = createFeatureSelector<RouterReducerState<fromRouter.RouterStateUrl>>('routerReducer');
