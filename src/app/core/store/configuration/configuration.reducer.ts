import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { ServerConfig } from 'ish-core/models/server-config/server-config.model';

import { ConfigurationAction, ConfigurationActionTypes } from './configuration.actions';

export interface ConfigurationState {
  baseURL?: string;
  server?: string;
  serverStatic?: string;
  serverConfig?: ServerConfig;
  channel?: string;
  application?: string;
  features?: string[];
  gtmToken?: string;
  theme?: string;
  error?: HttpError;
}

const initialState: ConfigurationState = {
  baseURL: undefined,
  server: undefined,
  serverStatic: undefined,
  serverConfig: undefined,
  channel: undefined,
  application: undefined,
  features: [],
  gtmToken: undefined,
  theme: undefined,
  error: undefined,
};

export function configurationReducer(state = initialState, action: ConfigurationAction): ConfigurationState {
  switch (action.type) {
    case ConfigurationActionTypes.ApplyConfiguration: {
      return { ...state, error: undefined, ...action.payload };
    }

    case ConfigurationActionTypes.SetGTMToken: {
      const { gtmToken } = action.payload;
      return { ...state, gtmToken };
    }

    case ConfigurationActionTypes.LoadServerConfigFail: {
      const { error } = action.payload;
      return { ...state, error };
    }
  }

  return state;
}
