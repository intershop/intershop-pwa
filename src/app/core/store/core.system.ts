import { routerReducer } from '@ngrx/router-store';
import { ActionReducerMap } from '@ngrx/store';
import { CoreState } from './core.state';
import { CountriesEffects } from './countries/countries.effects';
import { countriesReducer } from './countries/countries.reducer';
import { ErrorEffects } from './error/error.effects';
import { errorReducer } from './error/error.reducer';
import { LocaleEffects } from './locale/locale.effects';
import { localeReducer } from './locale/locale.reducer';
import { UserEffects } from './user/user.effects';
import { userReducer } from './user/user.reducer';

export const coreReducers: ActionReducerMap<CoreState> = {
  routerReducer: routerReducer,
  user: userReducer,
  locale: localeReducer,
  countries: countriesReducer,
  error: errorReducer
};

export const coreEffects: any[] = [UserEffects, LocaleEffects, CountriesEffects, ErrorEffects];

export * from './router/router.serializers';
