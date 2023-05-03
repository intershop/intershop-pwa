import { createReducer, on } from '@ngrx/store';

import { DeviceType } from 'ish-core/models/viewtype/viewtype.types';
import { Translations } from 'ish-core/utils/translate/translations.type';

import { environment } from '../../../../../environments/environment';

import {
  applyConfiguration,
  loadSingleServerTranslationSuccess,
  notifyLazyFeatureLoaded,
} from './configuration.actions';

export interface ConfigurationState {
  baseURL?: string;
  server?: string;
  serverStatic?: string;
  channel?: string;
  application?: string;
  hybridApplication?: string;
  identityProvider?: string;
  identityProviders?: { [id: string]: { type?: string; [key: string]: unknown } };
  features?: string[];
  addFeatures?: string[];
  lazyFeaturesLoaded?: { [id: string]: boolean };
  defaultLocale?: string;
  fallbackLocales?: string[];
  localeCurrencyOverride?: { [locale: string]: string | string[] };
  lang?: string;
  currency?: string;
  serverTranslations: { [lang: string]: Translations };
  multiSiteLocaleMap: Record<string, unknown>;
  // not synced via state transfer
  _deviceType?: DeviceType;
}

const initialState: ConfigurationState = {
  baseURL: undefined,
  server: undefined,
  serverStatic: undefined,
  channel: undefined,
  application: undefined,
  hybridApplication: undefined,
  features: undefined,
  addFeatures: [],
  lazyFeaturesLoaded: {
    compare: false,
    rating: false,
    recently: false,
    productNotifications: false,
    storeLocator: false,
    contactUs: false,
    businessCustomerRegistration: true,
    costCenters: false,
    messageToMerchant: false,
    quoting: false,
    quickorder: true,
    orderTemplates: false,
    punchout: false,
    guestCheckout: true,
    wishlists: false,
    sentry: false,
    tracking: false,
    tacton: false,
    maps: false,
  },
  defaultLocale: environment.defaultLocale,
  fallbackLocales: environment.fallbackLocales,
  localeCurrencyOverride: environment.localeCurrencyOverride,
  lang: undefined,
  currency: undefined,
  serverTranslations: {},
  multiSiteLocaleMap: undefined,
  _deviceType: environment.defaultDeviceType,
};

function addSingleTranslation(
  state: ConfigurationState,
  lang: string,
  key: string,
  translation: string
): ConfigurationState {
  return {
    ...state,
    serverTranslations: {
      ...state.serverTranslations,
      [lang]: { ...state.serverTranslations?.[lang], [key]: translation },
    },
  };
}

export const configurationReducer = createReducer(
  initialState,
  on(applyConfiguration, (state, action): ConfigurationState => ({ ...state, ...action.payload })),
  on(loadSingleServerTranslationSuccess, (state, action) =>
    addSingleTranslation(state, action.payload.lang, action.payload.key, action.payload.translation)
  ),
  on(
    notifyLazyFeatureLoaded,
    (state, action): ConfigurationState => ({
      ...state,
      lazyFeaturesLoaded: { ...state.lazyFeaturesLoaded, [action.payload.feature]: true },
    })
  )
);
