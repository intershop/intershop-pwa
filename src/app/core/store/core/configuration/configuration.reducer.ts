import { createReducer, on } from '@ngrx/store';

import { Locale } from 'ish-core/models/locale/locale.model';
import { DeviceType } from 'ish-core/models/viewtype/viewtype.types';
import { Translations } from 'ish-core/utils/translate/translations.type';

import { environment } from '../../../../../environments/environment';

import { applyConfiguration, loadServerTranslationsFail, loadServerTranslationsSuccess } from './configuration.actions';

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
  locales?: Locale[];
  lang?: string;
  serverTranslations: { [lang: string]: Translations };
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
  locales: environment.locales,
  lang: undefined,
  serverTranslations: {},
  _deviceType: environment.defaultDeviceType,
};

function setTranslations(state: ConfigurationState, lang: string, translations: Translations): ConfigurationState {
  return {
    ...state,
    serverTranslations: { ...state.serverTranslations, [lang]: translations },
  };
}

export const configurationReducer = createReducer(
  initialState,
  on(applyConfiguration, (state, action) => ({ ...state, ...action.payload })),
  on(loadServerTranslationsSuccess, (state, action) =>
    setTranslations(state, action.payload.lang, action.payload.translations)
  ),
  on(loadServerTranslationsFail, (state, action) => setTranslations(state, action.payload.lang, {}))
);
