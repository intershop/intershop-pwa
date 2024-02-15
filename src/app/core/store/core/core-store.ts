import { RouterReducerState } from '@ngrx/router-store';
import { Selector } from '@ngrx/store';

import { ConfigurationState } from 'ish-core/store/core/configuration/configuration.reducer';
import { ErrorState } from 'ish-core/store/core/error/error.reducer';
import { ViewconfState } from 'ish-core/store/core/viewconf/viewconf.reducer';

import { RouterState } from './router/router.reducer';
import { ServerConfigState } from './server-config/server-config.reducer';

export interface CoreState {
  router: RouterReducerState<RouterState>;
  error: ErrorState;
  viewconf: ViewconfState;
  configuration: ConfigurationState;
  serverConfig: ServerConfigState;
}

export const getCoreState: Selector<CoreState, CoreState> = state => state;
