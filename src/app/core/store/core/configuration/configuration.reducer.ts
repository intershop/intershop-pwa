import { createReducer, on } from '@ngrx/store';

import { DeviceType } from 'ish-core/models/viewtype/viewtype.types';
import { Translations } from 'ish-core/utils/translate/translations.type';

import { environment } from '../../../../../environments/environment';

import {
  applyConfiguration,
  loadServerTranslationsFail,
  loadServerTranslationsSuccess,
  loadSingleServerTranslationSuccess,
} from './configuration.actions';

export interface ConfigurationState {
  baseURL?: string;
  server?: string;
  serverStatic?: string;
  channel?: string;
  application?: string;
  identityProvider?: string;
  identityProviders?: { [id: string]: { type?: string; [key: string]: unknown } };
  features?: string[];
  theme?: string;
  defaultLocale?: string;
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
  features: undefined,
  theme: undefined,
  defaultLocale: environment.defaultLocale,
  localeCurrencyOverride: environment.localeCurrencyOverride,
  lang: undefined,
  currency: undefined,
  serverTranslations: {},
  multiSiteLocaleMap: {},
  _deviceType: environment.defaultDeviceType,
};

function setTranslations(state: ConfigurationState, lang: string, translations: Translations): ConfigurationState {
  return {
    ...state,
    serverTranslations: { ...state.serverTranslations, [lang]: translations },
  };
}

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
  on(applyConfiguration, (state, action) => ({ ...state, ...action.payload })),
  on(loadServerTranslationsSuccess, (state, action) =>
    setTranslations(state, action.payload.lang, action.payload.translations)
  ),
  on(loadServerTranslationsFail, (state, action) => setTranslations(state, action.payload.lang, {})),
  on(loadSingleServerTranslationSuccess, (state, action) =>
    addSingleTranslation(state, action.payload.lang, action.payload.key, action.payload.translation)
  )
);
