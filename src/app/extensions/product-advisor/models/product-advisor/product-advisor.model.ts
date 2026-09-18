/**
 * A tool call executed by the Flowise chatflow, e.g. an ICM product search.
 * Mirrors the structure the Copilot exposes via its embed.
 */
export interface ProductAdvisorToolCall {
  tool: string;
  toolInput: Record<string, unknown>;
  toolOutput?: string;
  /** Error thrown by the chatflow tool during execution, if any. */
  error?: string;
}

/**
 * A source document returned by the chatflow (RAG context, product references, etc.).
 */
export interface ProductAdvisorSourceDocument {
  pageContent?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Options that influence a single prediction request.
 */
export interface ProductAdvisorRequestOptions {
  /** Unique identifier that keeps a user's conversation separate across requests. */
  sessionId?: string;
  /** Flowise chat instance ID to continue an existing conversation. */
  chatId?: string;
  /** Additional chatflow variables merged into `overrideConfig.vars` for this request. */
  vars?: Record<string, unknown>;
}

/**
 * The response of a non-streaming Flowise prediction request
 * (`POST {apiHost}/api/v1/prediction/{chatflowid}`).
 */
export interface ProductAdvisorResponse {
  text: string;
  question?: string;
  chatId?: string;
  chatMessageId?: string;
  sessionId?: string;
  usedTools?: ProductAdvisorToolCall[];
  sourceDocuments?: ProductAdvisorSourceDocument[];
}

/**
 * A single Server-Sent Event emitted during a streaming prediction.
 *
 * Flowise emits typed events such as `start`, `token`, `usedTools`, `sourceDocuments`,
 * `metadata`, `error` and `end`. The `data` payload depends on the event type
 * (e.g. a string token for `token`, a `ProductAdvisorToolCall[]` for `usedTools`).
 */
export interface ProductAdvisorStreamEvent {
  event: string;
  data: unknown;
}

/**
 * A single rendered chat message in the Product Advisor transcript.
 */
export interface ProductAdvisorChatMessage {
  message: string;
  type: 'apiMessage' | 'userMessage';
  usedTools?: ProductAdvisorToolCall[];
  messageId?: string;
  dateTime?: string;
}

/**
 * The persisted conversation: the rendered transcript plus the Flowise chat instance ID.
 * Mirrors the embed's `{chatflowid}_EXTERNAL` localStorage entry.
 */
export interface ProductAdvisorChatSession {
  chatId?: string;
  chatHistory: ProductAdvisorChatMessage[];
}
