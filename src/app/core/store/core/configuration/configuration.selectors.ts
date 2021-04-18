import { createSelector, createSelectorFactory, resultMemoize } from '@ngrx/store';
import { isEqual } from 'lodash-es';

import { Locale } from 'ish-core/models/locale/locale.model';
import { getCoreState } from 'ish-core/store/core/core-store';
import { getServerConfigParameter } from 'ish-core/store/core/server-config';

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

/**
 * locales configured in environment.ts
 */
const internalLocales = createSelector(getConfigurationState, state => state.locales);

/**
 * environment.ts locales filtered by locales configured in ICM
 */
export const getAvailableLocales = createSelector(
  internalLocales,
  getServerConfigParameter<string[]>('general.locales'),
  (configured, activated) =>
    activated?.length ? activated.map(lang => configured?.find(l => l.lang === lang)).filter(x => !!x) : configured
);

const internalRequestedLocale = createSelector(getConfigurationState, state => state.lang);

function findBestLocale(available: Locale[], requested: string): Locale {
  const modified = requested?.replace('-', '_');
  const perfectMatch = available?.find(l => l.lang === modified);
  if (perfectMatch) {
    return perfectMatch;
  }
  const justLanguage = modified?.replace(/_.*/, '');
  return available.find(l => l.lang.startsWith(justLanguage));
}

/**
 * tries to find a best match for requested locale,
 * falls back to ICM configured default locale if no match is found,
 * and finally falls back to first available locale if none is configured
 */
export const getCurrentLocale = createSelector(
  getAvailableLocales,
  internalRequestedLocale,
  getServerConfigParameter<string>('general.defaultLocale'),
  (available, requested, configuredDefault) =>
    findBestLocale(available, requested) || findBestLocale(available, configuredDefault) || available[0]
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
