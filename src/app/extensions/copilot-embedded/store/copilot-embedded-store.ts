import { createFeatureSelector } from '@ngrx/store';

import { CopilotEmbeddedChat } from '../models/copilot-embedded-chat/copilot-embedded-chat.model';
import { CopilotEmbeddedConfig } from '../models/copilot-embedded-config/copilot-embedded-config.model';

export interface CopilotEmbeddedState {
  copilotEmbeddedConfig: CopilotEmbeddedConfig;
  _chat: CopilotEmbeddedChat;
}

export const getCopilotEmbeddedState = createFeatureSelector<CopilotEmbeddedState>('copilotEmbedded');
