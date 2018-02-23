import { routerReducer } from '@ngrx/router-store';
import { ActionReducerMap } from '@ngrx/store';
import { CoreState } from './core.state';
import { LocaleEffects } from './locale/locale.effects';
import { localeReducer } from './locale/locale.reducer';
import { RouterEffects } from './router/router.effects';
import { UserEffects } from './user/user.effects';
import { userReducer } from './user/user.reducer';


export const reducers: ActionReducerMap<CoreState> = {
  routerReducer: routerReducer,
  user: userReducer,
  locale: localeReducer,
};

export const effects: any[] = [UserEffects, RouterEffects, LocaleEffects];

export * from './router/router.serializers';
