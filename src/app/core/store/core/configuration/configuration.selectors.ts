import { createSelector, createSelectorFactory, resultMemoize } from '@ngrx/store';
import { isEqual } from 'lodash-es';

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

const defaultLocale = createSelector(getConfigurationState, state => state.defaultLocale);

/**
 * locales configured in environment.ts
 */
const internalLocales = createSelector(getConfigurationState, state => state.locales);

/**
 * environment.ts locales filtered by locales configured in ICM
 *
 * TODO: available locales should not be filtered by local environment,
 * if no locale is available, then a default configured locale from environment.ts should be loaded as fallback
 */
export const getAvailableLocales = createSelector(
  internalLocales,
  getServerConfigParameter<string[]>('general.locales'),
  (configured, activated) =>
    activated?.length ? activated.map(lang => configured?.find(l => l.lang === lang)).filter(x => !!x) : configured
);

const internalRequestedLocale = createSelector(getConfigurationState, state => state.lang);

/**
 * selects the current locale if set. If not returns the first available locale
 * tries to find requested locale,
 * falls back to ICM configured default locale if no match is found,
 * and finally falls back to first available locale if none is configured
 */
export const getCurrentLocale = createSelector(
  getAvailableLocales,
  internalRequestedLocale,
  defaultLocale,
  getServerConfigParameter<string>('general.defaultLocale'),
  (available, requested, internalDefaultLocale, configuredDefault) =>
    available?.find(l => l.lang === requested) ??
    available?.find(l => l.lang === configuredDefault) ??
    available?.find(l => l.lang === internalDefaultLocale) ??
    available?.[0]
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
