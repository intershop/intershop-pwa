import { createAction } from '@ngrx/store';

import { httpError, payload } from 'ish-core/utils/ngrx-creators';
import { Translations } from 'ish-core/utils/translate/translations.type';

import { ConfigurationState } from './configuration.reducer';

type ConfigurationType = Partial<ConfigurationState>;

export const applyConfiguration = createAction('[Configuration] Apply Configuration', payload<ConfigurationType>());

export const loadServerTranslations = createAction(
  '[Configuration] Load Server Translations',
  payload<{ lang: string }>()
);

export const loadServerTranslationsSuccess = createAction(
  '[Configuration] Load Server Translations Success',
  payload<{ lang: string; translations: Translations }>()
);

export const loadServerTranslationsFail = createAction(
  '[Configuration] Load Server Translations Fail',
  httpError<{ lang: string }>()
);

export const loadSingleServerTranslation = createAction(
  '[Configuration] Load Single Server Translation',
  payload<{ lang: string; key: string }>()
);

export const loadSingleServerTranslationSuccess = createAction(
  '[Configuration] Load Single Server Translation Success',
  payload<{ lang: string; key: string; translation: string }>()
);
