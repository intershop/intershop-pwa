import { createSelector, createSelectorFactory, resultMemoize } from '@ngrx/store';
import { isEqual } from 'lodash-es';

import { getCoreState } from 'ish-core/store/core/core-store';

import { ConfigurationState } from './configuration.reducer';

export const getConfigurationState = createSelector(getCoreState, state => state.configuration);

export const getICMApplication = createSelector(getConfigurationState, state => state.application || '-');

export const getICMServerURL = createSelector(getConfigurationState, state =>
  state.baseURL && state.server ? `${state.baseURL}/${state.server}` : undefined
);

export const getRestEndpoint = createSelector(
  getICMServerURL,
  getConfigurationState,
  getICMApplication,
  (serverUrl, state, application) =>
    serverUrl && state.channel ? `${serverUrl}/${state.channel}/${application}` : undefined
);

export const getICMStaticURL = createSelector(getConfigurationState, getICMApplication, (state, application) =>
  state.baseURL && state.serverStatic && state.channel
    ? `${state.baseURL}/${state.serverStatic}/${state.channel}/${application}`
    : undefined
);

export const getICMBaseURL = createSelector(getConfigurationState, state => state.baseURL);

export const getFeatures = createSelector(getConfigurationState, state => state.features);

export const getTheme = createSelector(getConfigurationState, state => state.theme);

export const getAvailableLocales = createSelector(getConfigurationState, state => state.locales);

/**
 * selects the current locale if set. If not returns the first available locale
 */
export const getCurrentLocale = createSelector(
  getConfigurationState,
  state => state.locales.find(l => l.lang === state.lang) || state.locales[0]
);

export const getDeviceType = createSelector(getConfigurationState, state => state._deviceType);

export const getIdentityProvider = createSelectorFactory<
  object,
  {
    [key: string]: unknown;
    type?: string;
  }
>(projector => resultMemoize(projector, isEqual))(
  getConfigurationState,
  (state: ConfigurationState) =>
    state.identityProvider &&
    (state.identityProvider === 'ICM' ? { type: 'ICM' } : state.identityProviders?.[state.identityProvider])
);
