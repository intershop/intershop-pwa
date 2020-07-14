import { createAction } from '@ngrx/store';

import { payload } from 'ish-core/utils/ngrx-creators';

import { TactonConfig } from '../../models/tacton-config/tacton-config.model';

export const loadTactonConfig = createAction('[Tacton Config Internal] Load Tacton Config');

export const setTactonConfig = createAction(
  '[Tacton Config Internal] Set Tacton Config',
  payload<{ config: TactonConfig }>()
);
