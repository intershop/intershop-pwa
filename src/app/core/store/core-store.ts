import { RouterReducerState } from '@ngrx/router-store';
import { Selector } from '@ngrx/store';

import { AddressesState } from './addresses/addresses.reducer';
import { ConfigurationState } from './configuration/configuration.reducer';
import { CountriesState } from './countries/countries.reducer';
import { ErrorState } from './error/error.reducer';
import { LocaleState } from './locale/locale.reducer';
import { OrdersState } from './orders/orders.reducer';
import { RegionsState } from './regions/regions.reducer';
import { UserState } from './user/user.reducer';
import { ViewconfState } from './viewconf/viewconf.reducer';

export interface CoreState {
  // tslint:disable-next-line: no-any
  router: RouterReducerState<any>;
  user: UserState;
  addresses: AddressesState;
  orders: OrdersState;
  locale: LocaleState;
  countries: CountriesState;
  regions: RegionsState;
  error: ErrorState;
  viewconf: ViewconfState;
  configuration: ConfigurationState;
}

export const getCoreState: Selector<CoreState, CoreState> = state => state;
