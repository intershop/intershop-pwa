import { createSelector } from '@ngrx/store';

import { getCopilotEmbeddedState } from '../copilot-embedded-store';

export const getCopilotEmbeddedChat = createSelector(getCopilotEmbeddedState, state => state?._chat);
