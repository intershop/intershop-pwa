import { CopilotEmbeddedChoicePrompt } from '../copilot-embedded-choice/copilot-embedded-choice.model';
import { CopilotEmbeddedProduct } from '../copilot-embedded-product/copilot-embedded-product.model';

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
 * The persisted conversation: the rendered transcript plus the Flowise chat instance ID.
 * Mirrors the embed's `{chatflowid}_EXTERNAL` localStorage entry.
 */
export interface CopilotEmbeddedChatSession {
  chatId?: string;
  chatHistory: CopilotEmbeddedChatMessage[];
}
