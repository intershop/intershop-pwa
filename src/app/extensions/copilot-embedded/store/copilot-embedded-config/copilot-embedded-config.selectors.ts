import { createSelector } from '@ngrx/store';

import { getCopilotEmbeddedState } from '../copilot-embedded-store';

export const getCopilotEmbeddedConfig = createSelector(getCopilotEmbeddedState, state => state?.copilotEmbeddedConfig);
