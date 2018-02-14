import { routerReducer, RouterReducerState } from '@ngrx/router-store';
import { ActionReducerMap } from '@ngrx/store';
import { RouterEffects } from './router/router.effects';
import { RouterStateUrl } from './router/router.reducer';
import { UserEffects } from './user/user.effects';
import { UserState, userStateReducer } from './user/user.reducer';

export interface State {
  routerReducer: RouterReducerState<RouterStateUrl>;
  user: UserState;
}

export const reducers: ActionReducerMap<State> = {
  routerReducer: routerReducer,
  user: userStateReducer,
};

export const effects: any[] = [UserEffects, RouterEffects];

export * from './router/router.serializers';
