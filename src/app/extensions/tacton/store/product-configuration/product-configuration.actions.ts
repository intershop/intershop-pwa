import { createAction } from '@ngrx/store';

import { httpError, payload } from 'ish-core/utils/ngrx-creators';

import { TactonProductConfiguration } from '../../models/tacton-product-configuration/tacton-product-configuration.model';
import { TactonSavedConfiguration } from '../../models/tacton-saved-configuration/tacton-saved-configuration.model';

export const startConfigureTactonProduct = createAction(
  '[Tacton Self-Service API] Start Product Configuration',
  payload<{ productPath: string }>()
);

export const continueConfigureTactonProduct = createAction(
  '[Tacton Self-Service API] Continue Product Configuration',
  payload<{ savedConfig: TactonSavedConfiguration }>()
);

export const setCurrentConfiguration = createAction(
  '[Tacton Self-Service API] Set Product Configuration',
  payload<{ configuration: TactonProductConfiguration }>()
);

export const clearTactonConfiguration = createAction('[Tacton Self-Service API] Clear Configuration');

export const commitTactonConfigurationValue = createAction(
  '[Tacton Self-Service API] Commit Configuration Value',
  payload<{ valueId: string; value: string }>()
);

export const uncommitTactonConfigurationValue = createAction(
  '[Tacton Self-Service API] Uncommit Configuration Value',
  payload<{ valueId: string }>()
);

export const changeTactonConfigurationStep = createAction(
  '[Tacton Self-Service API] Change Configuration Step',
  payload<{ step: string }>()
);

export const submitTactonConfiguration = createAction('[Tacton Self-Service API] Submit Configuration');

export const submitTactonConfigurationSuccess = createAction(
  '[Tacton Self-Service API] Submit Configuration Success',
  payload<{ productId: string; user: string }>()
);

export const submitTactonConfigurationFail = createAction(
  '[Tacton Self-Service API] Submit Configuration Failed',
  httpError<{ productId: string; user: string }>()
);
