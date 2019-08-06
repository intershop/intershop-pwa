import { Action } from '@ngrx/store';

import { ConfigurationState } from './configuration.reducer';

export enum ConfigurationActionTypes {
  ApplyConfiguration = '[Configuration] Apply Configuration',
  SetGTMToken = '[Configuration] Set Google Tag Manager Token',
}

type ConfigurationType = Partial<ConfigurationState>;

export class ApplyConfiguration implements Action {
  readonly type = ConfigurationActionTypes.ApplyConfiguration;
  constructor(public payload: ConfigurationType) {}
}

export class SetGTMToken implements Action {
  type = ConfigurationActionTypes.SetGTMToken;
  constructor(public payload: { gtmToken: string }) {}
}

export type ConfigurationAction = ApplyConfiguration | SetGTMToken;
