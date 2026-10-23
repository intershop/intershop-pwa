import { createActionGroup, emptyProps } from '@ngrx/store';

import { payload } from 'ish-core/utils/ngrx-creators';

import { CopilotEmbeddedChat } from '../../models/copilot-embedded-chat/copilot-embedded-chat.model';

export const copilotEmbeddedChatActions = createActionGroup({
  source: 'Copilot Embedded Chat',
  events: {
    'Set Copilot Embedded Chat': payload<{ chat: CopilotEmbeddedChat }>(),
    'Reset Copilot Embedded Chat': emptyProps(),
  },
});
