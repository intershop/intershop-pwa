import { Action } from '@ngrx/store';

import { ConfigurationState } from './configuration.reducer';

export enum ConfigurationActionTypes {
  ApplyConfiguration = '[Configuration] Apply Configuration',
}

declare type ConfigurationType = Partial<ConfigurationState>;

export class ApplyConfiguration implements Action {
  readonly type = ConfigurationActionTypes.ApplyConfiguration;
  constructor(public payload: ConfigurationType) {}
}

export type ConfigurationAction = ApplyConfiguration;
