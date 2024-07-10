import { createFeatureSelector } from '@ngrx/store';

import { CopilotToolCall } from './copilot.reducer';

// Define the structure of the CopilotState interface
export interface CopilotCheck {
  _copilot: CopilotToolCall;
}

// Create a feature selector for the copilot state
export const getCopilotToolCall = createFeatureSelector<CopilotToolCall>('copilot');
