import { RouterReducerState } from '@ngrx/router-store';
import { RouterStateUrl } from './router/router.reducer';
import { UserState } from './user/user.reducer';

export interface CoreState {
  routerReducer: RouterReducerState<RouterStateUrl>;
  user: UserState;
}
