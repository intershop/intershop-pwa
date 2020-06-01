import { Action } from '@ngrx/store';

import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { ServerConfig } from 'ish-core/models/server-config/server-config.model';

export enum ServerConfigActionTypes {
  LoadServerConfig = '[Configuration Internal] Get the ICM configuration',
  LoadServerConfigSuccess = '[Configuration API] Get the ICM configuration Success',
  LoadServerConfigFail = '[Configuration API] Get the ICM configuration Fail',
}

export class LoadServerConfig implements Action {
  readonly type = ServerConfigActionTypes.LoadServerConfig;
}

export class LoadServerConfigSuccess implements Action {
  readonly type = ServerConfigActionTypes.LoadServerConfigSuccess;
  constructor(public payload: { config: ServerConfig }) {}
}

export class LoadServerConfigFail implements Action {
  readonly type = ServerConfigActionTypes.LoadServerConfigFail;
  constructor(public payload: { error: HttpError }) {}
}

export type ServerConfigAction = LoadServerConfig | LoadServerConfigSuccess | LoadServerConfigFail;
