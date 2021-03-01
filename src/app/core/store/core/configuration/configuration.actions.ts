import { createAction } from '@ngrx/store';

import { payload } from 'ish-core/utils/ngrx-creators';

import { ConfigurationState } from './configuration.reducer';

type ConfigurationType = Partial<ConfigurationState>;

export const applyConfiguration = createAction('[Configuration] Apply Configuration', payload<ConfigurationType>());

export const setLocale = createAction('[Configuration] Set Locale e.g. de_DE', payload<{ lang: string }>());
