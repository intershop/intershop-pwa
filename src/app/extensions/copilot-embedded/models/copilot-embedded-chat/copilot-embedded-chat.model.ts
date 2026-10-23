import { CopilotEmbeddedChatMessage } from '../copilot-embedded-chat-message/copilot-embedded-chat-message.model';

/**
 * The persisted conversation: the rendered transcript plus the Flowise session and chat instance IDs.
 */
export interface CopilotEmbeddedChat {
  /** Chatflow the conversation belongs to; a conversation of another chatflow is not restored. */
  chatflowid: string;
  sessionId: string;
  messages: CopilotEmbeddedChatMessage[];
  chatId?: string;
}
