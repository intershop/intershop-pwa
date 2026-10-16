import { CopilotEmbeddedUpload } from '../copilot-embedded-upload/copilot-embedded-upload.model';

/**
 * Options that influence a single chat request.
 */
export interface CopilotEmbeddedRequestOptions {
  /** Unique identifier that keeps a user's conversation separate across requests. */
  sessionId?: string;
  /** Flowise chat instance ID to continue an existing conversation. */
  chatId?: string;
  /** Image/file attachments forwarded to the chatflow for vision input. */
  uploads?: CopilotEmbeddedUpload[];
  /** Products currently shown in the results panel, in display order. */
  shownProducts?: { sku: string; title?: string }[];
  /** Additional chatflow variables merged into `overrideConfig.vars` for this request. */
  vars?: Record<string, unknown>;
}

/**
 * A chat message with the PWA context resolved, ready to be sent to the Flowise chatflow.
 */
export interface CopilotEmbeddedChatRequest {
  question: string;
  sessionId?: string;
  chatId?: string;
  uploads?: CopilotEmbeddedUpload[];
  /** Chatflow variables sent as `overrideConfig.vars`. */
  vars: Record<string, unknown>;
  /** Current basket, appended to the question as `[CURRENT_BASKET]` marker. */
  basket: { sku: string; quantity: number }[];
  /** Order templates of the user, appended to the question as `[ORDER_TEMPLATES]` marker. */
  orderTemplates: { id: string; title: string }[];
  /** Products shown in the results panel, appended to the question as `[SHOWN_PRODUCTS]` marker. */
  shownProducts: { sku: string; title?: string }[];
}
