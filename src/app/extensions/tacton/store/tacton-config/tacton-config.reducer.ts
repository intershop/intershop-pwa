import { createReducer, on } from '@ngrx/store';

import { setTactonConfig } from './tacton-config.actions';

export const tactonConfigReducer = createReducer(
  undefined,
  on(setTactonConfig, (_, action) => action.payload.config)
);
