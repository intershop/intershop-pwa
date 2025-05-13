import { createAction } from '@ngrx/store';

import { CustomFieldDefinitions, ServerConfig } from 'ish-core/models/server-config/server-config.model';
import { httpError, payload } from 'ish-core/utils/ngrx-creators';

export const loadServerConfig = createAction('[Configuration Internal] Get the ICM configuration');

export const loadServerConfigSuccess = createAction(
  '[Configuration API] Get the ICM configuration Success',
  payload<{ config: ServerConfig; definitions?: CustomFieldDefinitions }>()
);

export const loadServerConfigFail = createAction('[Configuration API] Get the ICM configuration Fail', httpError());

export const loadExtraConfigSuccess = createAction(
  '[CMS API] Get extra ICM configuration from CMS Success',
  payload<{ extra: ServerConfig }>()
);

export const loadExtraConfigFail = createAction('[CMS API] Get extra ICM configuration from CMS Fail', httpError());
