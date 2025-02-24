import { createSelector } from '@ngrx/store';

import { getCopilotState } from '../copilot-store';

export const getCopilotConfig = createSelector(getCopilotState, state => state?.copilotConfig);
