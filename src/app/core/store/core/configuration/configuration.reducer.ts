import { Locale } from 'ish-core/models/locale/locale.model';
import { DeviceType } from 'ish-core/models/viewtype/viewtype.types';

import { environment } from '../../../../../environments/environment';

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
  locales?: Locale[];
  lang?: string;
  // not synced via state transfer
  _deviceType?: DeviceType;
}

const initialState: ConfigurationState = {
  baseURL: undefined,
  server: undefined,
  serverStatic: undefined,
  channel: undefined,
  application: undefined,
  features: undefined,
  gtmToken: undefined,
  theme: undefined,
  locales: environment.locales,
  lang: undefined,
  _deviceType: environment.defaultDeviceType,
};

export function configurationReducer(state = initialState, action: ConfigurationAction): ConfigurationState {
  switch (action.type) {
    case ConfigurationActionTypes.ApplyConfiguration: {
      return { ...state, ...action.payload };
    }

    case ConfigurationActionTypes.SetGTMToken: {
      const { gtmToken } = action.payload;
      return { ...state, gtmToken };
    }
  }

  return state;
}
