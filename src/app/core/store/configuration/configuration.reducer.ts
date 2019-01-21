import { ConfigurationAction, ConfigurationActionTypes } from './configuration.actions';

export interface ConfigurationState {
  baseURL?: string;
  server?: string;
  serverStatic?: string;
  channel?: string;
  application?: string;
  features?: string[];
}

const initialState: ConfigurationState = {
  baseURL: undefined,
  server: undefined,
  serverStatic: undefined,
  channel: undefined,
  application: undefined,
  features: [],
};

export function configurationReducer(state = initialState, action: ConfigurationAction): ConfigurationState {
  if (action.type === ConfigurationActionTypes.ApplyConfiguration) {
    return { ...state, ...action.payload };
  }

  return state;
}
