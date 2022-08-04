import { createReducer, on } from '@ngrx/store';

import { TactonConfig } from '../../models/tacton-config/tacton-config.model';

import { setTactonConfig } from './tacton-config.actions';

export const tactonConfigReducer = createReducer(
  undefined,
  on(setTactonConfig, (_, action): TactonConfig => action.payload.config)
);
