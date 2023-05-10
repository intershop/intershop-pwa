import { createReducer, on } from '@ngrx/store';

import { ServerConfig } from 'ish-core/models/server-config/server-config.model';

import { loadExtraConfigSuccess, loadServerConfigSuccess } from './server-config.actions';

export interface ServerConfigState {
  _config: ServerConfig;
  extra: ServerConfig;
}

const initialState: ServerConfigState = {
  _config: undefined,
  extra: undefined,
};

export const serverConfigReducer = createReducer(
  initialState,
  on(
    loadServerConfigSuccess,
    (state, action): ServerConfigState => ({
      ...state,
      _config: action.payload.config,
    })
  ),
  on(
    loadExtraConfigSuccess,
    (state, action): ServerConfigState => ({
      ...state,
      extra: action.payload.extra,
    })
  )
);
