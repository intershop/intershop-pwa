import { createReducer, on } from '@ngrx/store';

import { SparqueConfig } from 'ish-core/models/sparque/sparque-config.model';

import { setSparqueConfig } from './sparque-config.actions';

export const sparqueConfigReducer = createReducer(
  undefined,
  on(setSparqueConfig, (_, action): SparqueConfig => action.payload.config)
);
