import { createReducer, on } from '@ngrx/store';

import { ServerConfig } from 'ish-core/models/server-config/server-config.model';

import { loadServerConfigSuccess } from './server-config.actions';

export interface ServerConfigState {
  _config: ServerConfig;
}

const initialState: ServerConfigState = {
  _config: undefined,
};

export const serverConfigReducer = createReducer(
  initialState,
  on(loadServerConfigSuccess, (_, action) => ({
    _config: action.payload.config,
  }))
);
