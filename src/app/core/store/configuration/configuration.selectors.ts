import { createSelector } from '@ngrx/store';

import { getCoreState } from 'ish-core/store/core-store';
import { getCurrentLocale } from 'ish-core/store/locale';

export const getConfigurationState = createSelector(
  getCoreState,
  state => state.configuration
);

export const getICMServerURL = createSelector(
  getConfigurationState,
  state => {
    const parts = [state.baseURL, state.urlPrefix, state.restURLPath, state.serverGroup];
    return parts.every(x => !!x) ? parts.join('/') : undefined;
  }
);

export const getRestEndpoint = createSelector(
  getICMServerURL,
  getConfigurationState,
  (serverUrl, state) =>
    serverUrl && state.channel ? `${serverUrl}/${state.channel}/${state.application || '-'}` : undefined
);

export const getICMStaticURL = createSelector(
  getConfigurationState,
  state => {
    const parts = [
      state.baseURL,
      state.urlPrefix,
      state.staticURLPath,
      state.serverGroup,
      state.channel,
      state.application || '-',
    ];
    return parts.every(x => !!x) ? parts.join('/') : undefined;
  }
);

export const getICMWebURL = createSelector(
  getConfigurationState,
  getCurrentLocale,
  (state, locale) => {
    const parts = [
      state.urlPrefix,
      state.webURLPath,
      state.serverGroup,
      state.channel,
      locale.lang,
      state.application || '-',
      locale.currency,
    ];
    return parts.every(x => !!x) ? `/${parts.join('/')}` : undefined;
  }
);

export const getICMBaseURL = createSelector(
  getConfigurationState,
  state => state.baseURL
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
