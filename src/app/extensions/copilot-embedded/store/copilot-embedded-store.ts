import { createFeatureSelector } from '@ngrx/store';

import { CopilotEmbeddedConfig } from '../models/copilot-embedded-config/copilot-embedded-config.model';

export interface CopilotEmbeddedState {
  copilotEmbeddedConfig: CopilotEmbeddedConfig;
}

export const getCopilotEmbeddedState = createFeatureSelector<CopilotEmbeddedState>('copilotEmbedded');
