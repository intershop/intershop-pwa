import { isDevMode } from '@angular/core';
import { createSelector, createSelectorFactory, resultMemoize } from '@ngrx/store';
import { isEqual } from 'lodash-es';

import { getCoreState } from 'ish-core/store/core/core-store';
import { getServerConfigParameter } from 'ish-core/store/core/server-config';

import { ConfigurationState } from './configuration.reducer';

export const getConfigurationState = createSelector(getCoreState, state => state.configuration);

const getICMApplication = createSelector(getConfigurationState, state => state.application || '-');

export const getResponsiveStarterStoreApplication = createSelector(
  getConfigurationState,
  state => state.hybridApplication || '-'
);

const ssrBaseUrl = SSR && process.env.ICM_BASE_URL_SSR;

export const getICMServerURL = createSelector(getConfigurationState, state =>
  state.baseURL && state.server ? `${ssrBaseUrl || state.baseURL}/${state.server}` : undefined
);

export const getICMServerWebURL = createSelector(getConfigurationState, state =>
  state.baseURL && state.serverWeb ? `${ssrBaseUrl || state.baseURL}/${state.serverWeb}` : undefined
);

export const getICMStaticURL = createSelector(getConfigurationState, getICMApplication, (state, application) =>
  state.baseURL && state.serverStatic && state.channel
    ? `${state.baseURL}/${state.serverStatic}/${state.channel}/${application}`
    : undefined
);

export const getICMBaseURL = createSelector(getConfigurationState, state => state.baseURL);

export const getFeatures = createSelector(getConfigurationState, state =>
  state.features ? [...state.features, ...state.addFeatures] : undefined
);

const internalDefaultLocale = createSelector(getConfigurationState, state => state.defaultLocale);

const internalFallbackLocales = createSelector(getConfigurationState, state => state.fallbackLocales);

const internalCurrencyFilter = createSelector(getConfigurationState, state => state.localeCurrencyOverride);

/**
 * locales configured in ICM
 */
export const getAvailableLocales = createSelector(
  internalFallbackLocales,
  getServerConfigParameter<string[]>('general.locales'),
  (fallbackLocales, serverLocales) => (serverLocales?.length ? serverLocales : fallbackLocales)
);

const internalRequestedLocale = createSelector(getConfigurationState, state => state.lang);

const internalRequestedCurrency = createSelector(getConfigurationState, state => state.currency);

/**
 * selects the current locale if set. If not returns the first available locale
 * tries to find requested locale,
 * falls back to ICM configured default locale if no match is found,
 * and finally falls back to first available locale if none is configured
 */
export const getCurrentLocale = createSelector(
  getAvailableLocales,
  internalRequestedLocale,
  internalDefaultLocale,
  getServerConfigParameter<string>('general.defaultLocale'),
  (available, requested, defaultLocale, configuredDefault) =>
    isDevMode() && defaultLocale
      ? defaultLocale
      : available?.find(l => l === requested) ??
        available?.find(l => l === configuredDefault) ??
        available?.find(l => l === defaultLocale) ??
        available?.[0]
);

export const getAvailableCurrencies = createSelector(
  getCurrentLocale,
  internalCurrencyFilter,
  getServerConfigParameter<string[]>('general.currencies'),
  (currentLocale, filter, activated): string[] => {
    const curFilter = filter?.[currentLocale];
    if (curFilter) {
      if (Array.isArray(curFilter)) {
        if (curFilter.length) {
          return curFilter;
        }
      } else {
        return [curFilter];
      }
    }

    if (activated?.length) {
      return activated;
    }
  }
);

export const getCurrentCurrency = createSelector(
  getAvailableCurrencies,
  internalRequestedCurrency,
  getServerConfigParameter<string>('general.defaultCurrency'),
  (available, requested, configuredDefault) =>
    available?.find(l => l === requested) ?? available?.find(l => l === configuredDefault) ?? available?.[0]
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

const getServerTranslations = (lang: string) =>
  createSelector(getConfigurationState, state => state.serverTranslations?.[lang]);

export const getSpecificServerTranslation = (lang: string, key: string) =>
  createSelector(getServerTranslations(lang), translations => translations?.[key]);

export const getMultiSiteLocaleMap = createSelector(
  getConfigurationState,
  (state: ConfigurationState) => state.multiSiteLocaleMap
);

export const getRestEndpoint = createSelector(
  getICMServerURL,
  getConfigurationState,
  getICMApplication,
  (serverUrl, state, application) =>
    serverUrl && state.channel ? `${serverUrl}/${state.channel}/${application}` : undefined
);

export const getPipelineEndpoint = createSelector(
  getICMServerWebURL,
  getConfigurationState,
  getCurrentLocale,
  getICMApplication,
  getCurrentCurrency,
  (serverUrl, state, locale, application, currency) =>
    serverUrl && state.channel ? `${serverUrl}/${state.channel}/${locale}/${application}/${currency}` : undefined
);
