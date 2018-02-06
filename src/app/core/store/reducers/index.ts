import { routerReducer, RouterReducerState } from '@ngrx/router-store';
import { ActionReducerMap } from '@ngrx/store';
import * as fromLogin from './login.reducer';
import * as fromRouter from './router.reducer';

export interface State {
  routerReducer: RouterReducerState<fromRouter.RouterStateUrl>;
  login: fromLogin.LoginState;
}

export const reducers: ActionReducerMap<State> = {
  routerReducer: routerReducer,
  login: fromLogin.reducer,
};
