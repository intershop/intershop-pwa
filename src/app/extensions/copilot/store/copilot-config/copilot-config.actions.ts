import { createActionGroup, emptyProps } from '@ngrx/store';

import { payload } from 'ish-core/utils/ngrx-creators';

import { CopilotConfig } from '../../models/copilot-config/copilot-config.model';

export const copilotConfigInternalActions = createActionGroup({
  source: 'Copilot Config Internal',
  events: {
    'Load Copilot Config': emptyProps(),
    'Set Copilot Config': payload<{ config: CopilotConfig }>(),
  },
});
