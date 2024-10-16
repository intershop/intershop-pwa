import { createReducer, on } from '@ngrx/store';

import { setActiveTool } from './copilot.actions';

export type CopilotToolCall = string;

export const copilotReducer = createReducer(
  '',
  on(setActiveTool, (state, { payload: { tool } }) => (state.includes(tool) ? state : tool))
);
