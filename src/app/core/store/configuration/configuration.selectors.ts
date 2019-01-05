import { createSelector } from '@ngrx/store';

import { getCoreState } from '../core-store';

const getConfigurationState = createSelector(
  getCoreState,
  state => state.configuration
);

export const getICMServerURL = createSelector(
  getConfigurationState,
  state => (state.baseURL && state.server ? `${state.baseURL}/${state.server}` : undefined)
);

export const getRestEndpoint = createSelector(
  getICMServerURL,
  getConfigurationState,
  (serverUrl, state) => (serverUrl && state.channel ? `${serverUrl}/${state.channel}/-` : undefined)
);

export const getICMStaticURL = createSelector(
  getConfigurationState,
  state =>
    state.baseURL && state.serverStatic && state.channel
      ? `${state.baseURL}/${state.serverStatic}/${state.channel}/-`
      : undefined
);

export const getICMBaseURL = createSelector(
  getConfigurationState,
  state => state.baseURL
);
