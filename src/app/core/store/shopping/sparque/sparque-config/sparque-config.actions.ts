import { createAction } from '@ngrx/store';

import { payload } from 'ish-core/utils/ngrx-creators';

import { SparqueConfig } from 'ish-core/models/sparque/sparque-config.model';

export const loadSparqueConfig = createAction('[Sparque Config Internal] Load Sparque Config');

export const setSparqueConfig = createAction(
  '[Sparque Config Internal] Set Sparque Config',
  payload<{ config: SparqueConfig }>()
);
