import { createActionGroup, emptyProps } from '@ngrx/store';

import { payload } from 'ish-core/utils/ngrx-creators';

import { CopilotEmbeddedConfig } from '../../models/copilot-embedded-config/copilot-embedded-config.model';

export const copilotEmbeddedConfigInternalActions = createActionGroup({
  source: 'Copilot Embedded Config Internal',
  events: {
    'Load Copilot Embedded Config': emptyProps(),
    'Set Copilot Embedded Config': payload<{ config: CopilotEmbeddedConfig }>(),
  },
});
