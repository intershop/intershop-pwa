import { createFeatureSelector } from '@ngrx/store';

import { CopilotConfig } from '../models/copilot-config/copilot-config.model';

export interface CopilotState {
  copilotConfig: CopilotConfig;
}

export const getCopilotState = createFeatureSelector<CopilotState>('copilot');
