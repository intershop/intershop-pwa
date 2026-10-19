import { CopilotEmbeddedChoicePrompt } from '../copilot-embedded-choice/copilot-embedded-choice.model';
import { CopilotEmbeddedProduct } from '../copilot-embedded-product/copilot-embedded-product.model';
import { CopilotEmbeddedUpload } from '../copilot-embedded-upload/copilot-embedded-upload.model';

/**
 * The input the user sends, which becomes a user chat message.
 */
export interface CopilotEmbeddedUserInput {
  question: string;
  uploads?: CopilotEmbeddedUpload[];
  /** Small JPEG thumbnail of the attached image, kept as `imageUrl` of the chat message. */
  thumbnail?: string;
}

/**
 * A single rendered chat message in the Copilot Embedded transcript.
 */
export interface CopilotEmbeddedChatMessage {
  message: string;
  type: 'apiMessage' | 'userMessage';
  messageId?: string;
  dateTime?: string;
  /** Products recommended with this (bot) message, if any. */
  products?: CopilotEmbeddedProduct[];
  /** Predefined answer chips offered with this (bot) message, if any. */
  choices?: CopilotEmbeddedChoicePrompt;
  /** Small JPEG thumbnail (data URL) of an attached image, shown in the user bubble and persisted. */
  imageUrl?: string;
}

/**
 * The persisted conversation: the rendered transcript plus the Flowise session and chat instance IDs.
 */
export interface CopilotEmbeddedChatSession {
  sessionId: string;
  chatId?: string;
  chatHistory: CopilotEmbeddedChatMessage[];
}
