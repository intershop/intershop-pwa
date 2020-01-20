import { ConfigurationAction, ConfigurationActionTypes } from './configuration.actions';

export interface ConfigurationState {
  baseURL?: string;
  urlPrefix?: string;
  serverGroup?: string;
  restURLPath?: string;
  staticURLPath?: string;
  channel?: string;
  application?: string;
  features?: string[];
  gtmToken?: string;
  theme?: string;
}

const initialState: ConfigurationState = {
  baseURL: undefined,
  urlPrefix: undefined,
  serverGroup: undefined,
  restURLPath: undefined,
  staticURLPath: undefined,
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
