import { createAction } from '@ngrx/store';

import { payload } from 'ish-core/utils/ngrx-creators';

import { TactonProductConfiguration } from '../../models/tacton-product-configuration/tacton-product-configuration.model';

export const startConfigureTactonProduct = createAction(
  '[Tacton Self-Service API] Start Product Configuration',
  payload<{ productPath: string }>()
);

export const setCurrentConfiguration = createAction(
  '[Tacton Self-Service API] Set Product Configuration',
  payload<{ configuration: TactonProductConfiguration }>()
);

export const commitTactonConfigurationValue = createAction(
  '[Tacton Self-Service API] Commit Configuration Value',
  payload<{ valueId: string; value: string }>()
);

export const changeTactonConfigurationStep = createAction(
  '[Tacton Self-Service API] Change Configuration Step',
  payload<{ step: string }>()
);
