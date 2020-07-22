import { createAction } from '@ngrx/store';

import { payload } from 'ish-core/utils/ngrx-creators';

import { TactonProductConfiguration } from '../../models/tacton-product-configuration/tacton-product-configuration.model';

export const saveTactonConfigurationReference = createAction(
  '[Tacton Internal] Save Configuration Reference',
  payload<{ tactonProduct: string; configuration: TactonProductConfiguration; user: string }>()
);
