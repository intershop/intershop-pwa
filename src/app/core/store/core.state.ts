import { RouterReducerState } from '@ngrx/router-store';
import { CountriesState } from './countries/countries.reducer';
import { ErrorState } from './error/error.reducer';
import { LocaleState } from './locale/locale.reducer';
import { RouterStateUrl } from './router/router.reducer';
import { UserState } from './user/user.reducer';

export interface CoreState {
  routerReducer: RouterReducerState<RouterStateUrl>;
  user: UserState;
  locale: LocaleState;
  countries: CountriesState;
  error: ErrorState;
}
