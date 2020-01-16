import { createSelector } from '@ngrx/store';

import { getCoreState } from 'ish-core/store/core-store';

export const getConfigurationState = createSelector(
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
  (serverUrl, state) =>
    serverUrl && state.channel ? `${serverUrl}/${state.channel}/${state.application || '-'}` : undefined
);

export const getICMStaticURL = createSelector(
  getConfigurationState,
  state =>
    state.baseURL && state.serverStatic && state.channel
      ? `${state.baseURL}/${state.serverStatic}/${state.channel}/${state.application || '-'}`
      : undefined
);

export const getICMBaseURL = createSelector(
  getConfigurationState,
  state => state.baseURL
);

export const getICMChannel = createSelector(
  getConfigurationState,
  state => state.channel
);

export const getFeatures = createSelector(
  getConfigurationState,
  state => state.features
);

export const getGTMToken = createSelector(
  getConfigurationState,
  state => state.gtmToken
);

export const getTheme = createSelector(
  getConfigurationState,
  state => state.theme
);
