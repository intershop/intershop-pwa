import { CountriesState } from './countries/countries.reducer';
import { ErrorState } from './error/error.reducer';
import { LocaleState } from './locale/locale.reducer';
import { RoutingDataState } from './routing-data/routing-data.reducer';
import { UserState } from './user/user.reducer';

export interface CoreState {
  user: UserState;
  locale: LocaleState;
  countries: CountriesState;
  error: ErrorState;
  routingData: RoutingDataState;
}
