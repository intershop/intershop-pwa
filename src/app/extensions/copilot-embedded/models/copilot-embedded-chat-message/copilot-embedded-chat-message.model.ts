import { CopilotEmbeddedChoice } from '../copilot-embedded-choice/copilot-embedded-choice.model';
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
  choices?: CopilotEmbeddedChoice;
  /** Small JPEG thumbnail (data URL) of an attached image, shown in the user bubble and persisted. */
  imageUrl?: string;
}
