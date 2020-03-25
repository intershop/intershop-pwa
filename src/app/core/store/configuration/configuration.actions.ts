import { Action } from '@ngrx/store';

import { HttpError } from 'ish-core/models/http-error/http-error.model';

import { ConfigurationState } from './configuration.reducer';

export enum ConfigurationActionTypes {
  LoadServerConfig = '[Configuration Internal] Get the ICM configuration',
  LoadServerConfigFail = '[Configuration API] Get the ICM configuration Fail',
  ApplyConfiguration = '[Configuration] Apply Configuration',
  SetGTMToken = '[Configuration] Set Google Tag Manager Token',
}

type ConfigurationType = Partial<ConfigurationState>;

export class LoadServerConfig implements Action {
  readonly type = ConfigurationActionTypes.LoadServerConfig;
}

export class LoadServerConfigFail implements Action {
  readonly type = ConfigurationActionTypes.LoadServerConfigFail;
  constructor(public payload: { error: HttpError }) {}
}

export class ApplyConfiguration implements Action {
  readonly type = ConfigurationActionTypes.ApplyConfiguration;
  constructor(public payload: ConfigurationType) {}
}

export class SetGTMToken implements Action {
  readonly type = ConfigurationActionTypes.SetGTMToken;
  constructor(public payload: { gtmToken: string }) {}
}

export type ConfigurationAction = LoadServerConfig | LoadServerConfigFail | ApplyConfiguration | SetGTMToken;
