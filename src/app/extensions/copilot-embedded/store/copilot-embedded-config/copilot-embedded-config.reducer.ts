import { createReducer, on } from '@ngrx/store';

import { CopilotEmbeddedConfig } from '../../models/copilot-embedded-config/copilot-embedded-config.model';

import { copilotEmbeddedConfigInternalActions } from './copilot-embedded-config.actions';

export const copilotEmbeddedConfigReducer = createReducer(
  undefined,
  on(
    copilotEmbeddedConfigInternalActions.setCopilotEmbeddedConfig,
    (_, action): CopilotEmbeddedConfig => action.payload.config
  )
);
