import { ConfigurationAction, ConfigurationActionTypes } from './configuration.actions';

export interface ConfigurationState {
  baseURL?: string;
  server?: string;
  serverStatic?: string;
  channel?: string;
  application?: string;
  features?: string[];
  gtmToken?: string;
  theme?: string;
}

const initialState: ConfigurationState = {
  baseURL: undefined,
  server: undefined,
  serverStatic: undefined,
  channel: undefined,
  application: undefined,
  features: [],
  gtmToken: undefined,
  theme: undefined,
};

export function configurationReducer(state = initialState, action: ConfigurationAction): ConfigurationState {
  if (action.type === ConfigurationActionTypes.ApplyConfiguration) {
    return { ...state, ...action.payload };
  } else if (action.type === ConfigurationActionTypes.SetGTMToken) {
    const { gtmToken } = action.payload;
    return { ...state, gtmToken };
  }

  return state;
}
