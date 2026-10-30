import { createReducer, on } from '@ngrx/store';

import { resetUserData } from 'ish-core/store/customer/user';

import { CopilotEmbeddedChat } from '../../models/copilot-embedded-chat/copilot-embedded-chat.model';

import { copilotEmbeddedChatActions } from './copilot-embedded-chat.actions';

const initialState: CopilotEmbeddedChat = {
  chatflowid: undefined,
  sessionId: undefined,
  chatId: undefined,
  messages: [],
};

export const copilotEmbeddedChatReducer = createReducer(
  initialState,
  on(copilotEmbeddedChatActions.setCopilotEmbeddedChat, (_, action): CopilotEmbeddedChat => action.payload.chat),
  // the logout clears the chat so the next user of the browser cannot see it
  on(copilotEmbeddedChatActions.resetCopilotEmbeddedChat, resetUserData, (): CopilotEmbeddedChat => initialState)
);
