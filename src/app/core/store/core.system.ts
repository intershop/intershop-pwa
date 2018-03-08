import { routerReducer } from '@ngrx/router-store';
import { ActionReducerMap } from '@ngrx/store';
import { CoreState } from './core.state';
import { ErrorEffects } from './error/error.effects';
import { generalErrorReducer } from './error/error.reducer';
import { LocaleEffects } from './locale/locale.effects';
import { localeReducer } from './locale/locale.reducer';
import { UserEffects } from './user/user.effects';
import { userReducer } from './user/user.reducer';

export const reducers: ActionReducerMap<CoreState> = {
  routerReducer: routerReducer,
  user: userReducer,
  locale: localeReducer,
  error: generalErrorReducer
};

export const effects: any[] = [UserEffects, LocaleEffects, ErrorEffects];

export * from './router/router.serializers';
