import { ServerConfig } from 'ish-core/models/server-config/server-config.model';

import { ServerConfigAction, ServerConfigActionTypes } from './server-config.actions';

export interface ServerConfigState {
  _config: ServerConfig;
}

const initialState: ServerConfigState = {
  _config: undefined,
};

export function serverConfigReducer(state = initialState, action: ServerConfigAction): ServerConfigState {
  switch (action.type) {
    case ServerConfigActionTypes.LoadServerConfigSuccess: {
      return {
        _config: action.payload.config,
      };
    }
  }

  return state;
}
