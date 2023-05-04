import { createAction } from '@ngrx/store';

import { payload } from 'ish-core/utils/ngrx-creators';

import { ConfigurationState } from './configuration.reducer';

export type ConfigurationType = Partial<ConfigurationState>;

export const applyConfiguration = createAction('[Configuration] Apply Configuration', payload<ConfigurationType>());

export const loadSingleServerTranslation = createAction(
  '[Configuration] Load Single Server Translation',
  payload<{ lang: string; key: string }>()
);

export const loadSingleServerTranslationSuccess = createAction(
  '[Configuration] Load Single Server Translation Success',
  payload<{ lang: string; key: string; translation: string }>()
);
