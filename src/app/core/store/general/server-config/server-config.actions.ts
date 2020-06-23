import { createAction } from '@ngrx/store';

import { ServerConfig } from 'ish-core/models/server-config/server-config.model';
import { httpError, payload } from 'ish-core/utils/ngrx-creators';

export const loadServerConfig = createAction('[Configuration Internal] Get the ICM configuration');

export const loadServerConfigSuccess = createAction(
  '[Configuration API] Get the ICM configuration Success',
  payload<{ config: ServerConfig }>()
);

export const loadServerConfigFail = createAction('[Configuration API] Get the ICM configuration Fail', httpError());
