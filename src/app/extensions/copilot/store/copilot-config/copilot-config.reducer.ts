import { createReducer, on } from '@ngrx/store';

import { CopilotConfig } from '../../models/copilot-config/copilot-config.model';

import { copilotConfigInternalActions } from './copilot-config.actions';

export const copilotConfigReducer = createReducer(
  undefined,
  on(copilotConfigInternalActions.setCopilotConfig, (_, action): CopilotConfig => action.payload.config)
);
