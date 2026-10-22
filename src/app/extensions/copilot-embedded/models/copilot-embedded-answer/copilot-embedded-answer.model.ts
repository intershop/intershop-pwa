import { CopilotEmbeddedChoice } from '../copilot-embedded-choice/copilot-embedded-choice.model';
import { CopilotEmbeddedProduct } from '../copilot-embedded-product/copilot-embedded-product.model';
import { CopilotEmbeddedToolCall } from '../copilot-embedded-tool-call/copilot-embedded-tool-call.model';

/**
 * The answer of the Copilot Embedded chatflow to a chat request (streamed answers are emitted as received so far).
 */
export interface CopilotEmbeddedAnswer {
  text: string;
  /** Tool calls executed by the chatflow; the action tools still have to be performed by the PWA. */
  usedTools: CopilotEmbeddedToolCall[];
  /** Products recommended by the `icmSearch` tool. */
  products: CopilotEmbeddedProduct[];
  chatId?: string;
  messageId?: string;
  /** Predefined answer options offered by the `PWA_ask_choice` tool. */
  choices?: CopilotEmbeddedChoice;
}
