import { createReducer, on } from '@ngrx/store';

import { CustomFieldDefinitions, ServerConfig } from 'ish-core/models/server-config/server-config.model';

import { loadExtraConfigSuccess, loadServerConfigSuccess } from './server-config.actions';

export interface ServerConfigState {
  _config: ServerConfig;
  _definitions: CustomFieldDefinitions;
  extra: ServerConfig;
}

const initialState: ServerConfigState = {
  _config: undefined,
  _definitions: undefined,
  extra: undefined,
};

export const serverConfigReducer = createReducer(
  initialState,
  on(
    loadServerConfigSuccess,
    (state, action): ServerConfigState => ({
      ...state,
      _config: action.payload.config,
      _definitions: action.payload.definitions,
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
