import { createReducer, on } from '@ngrx/store';

import { FeatureToggleType } from 'ish-core/feature-toggle.module';
import { DeviceType } from 'ish-core/models/viewtype/viewtype.types';
import { Translations } from 'ish-core/utils/translate/translations.type';

import { environment } from '../../../../../environments/environment';

import { applyConfiguration, loadSingleServerTranslationSuccess } from './configuration.actions';

export interface ConfigurationState {
  baseURL?: string;
  server?: string;
  serverStatic?: string;
  serverWeb?: string;
  channel?: string;
  application?: string;
  hybridApplication?: string;
  identityProvider?: string;
  identityProviders?: { [id: string]: { type?: string; [key: string]: unknown } };
  features?: FeatureToggleType[];
  addFeatures?: FeatureToggleType[];
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
  serverWeb: undefined,
  channel: undefined,
  application: undefined,
  hybridApplication: undefined,
  features: undefined,
  addFeatures: [],
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
  )
);
