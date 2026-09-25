/**
 * A tool call executed by the Flowise chatflow, e.g. an ICM product search.
 * Mirrors the structure the Copilot exposes via its embed.
 */
export interface CopilotEmbeddedToolCall {
  tool: string;
  toolInput: Record<string, unknown>;
  toolOutput?: string;
  /** Error thrown by the chatflow tool during execution, if any. */
  error?: string;
}

/**
 * A source document returned by the chatflow (RAG context, product references, etc.).
 */
export interface CopilotEmbeddedSourceDocument {
  pageContent?: string;
  metadata?: Record<string, unknown>;
}

/**
 * An image (or file) attachment sent with a prediction request. The shape matches the
 * `uploads` entries the Flowise Prediction API expects for vision-enabled chat flows.
 */
export interface CopilotEmbeddedUpload {
  /** Base64-encoded data URL, e.g. `data:image/png;base64,...`. */
  data: string;
  type: 'file';
  name: string;
  mime: string;
}

/**
 * Options that influence a single prediction request.
 */
export interface CopilotEmbeddedRequestOptions {
  /** Unique identifier that keeps a user's conversation separate across requests. */
  sessionId?: string;
  /** Flowise chat instance ID to continue an existing conversation. */
  chatId?: string;
  /** Image/file attachments forwarded to the chatflow for vision input. */
  uploads?: CopilotEmbeddedUpload[];
  /** Additional chatflow variables merged into `overrideConfig.vars` for this request. */
  vars?: Record<string, unknown>;
}

/**
 * The response of a non-streaming Flowise prediction request
 * (`POST {apiHost}/api/v1/prediction/{chatflowid}`).
 */
export interface CopilotEmbeddedResponse {
  text: string;
  question?: string;
  chatId?: string;
  chatMessageId?: string;
  sessionId?: string;
  usedTools?: CopilotEmbeddedToolCall[];
  sourceDocuments?: CopilotEmbeddedSourceDocument[];
}

/**
 * A single Server-Sent Event emitted during a streaming prediction.
 *
 * Flowise emits typed events such as `start`, `token`, `usedTools`, `sourceDocuments`,
 * `metadata`, `error` and `end`. The `data` payload depends on the event type
 * (e.g. a string token for `token`, a `CopilotEmbeddedToolCall[]` for `usedTools`).
 */
export interface CopilotEmbeddedStreamEvent {
  event: string;
  data: unknown;
}

/**
 * A set of predefined answer options the Copilot Embedded offers for a question, rendered as clickable chips.
 * Produced by the `PWA_ask_choice` signal tool so the user can tap an answer instead of typing.
 */
export interface CopilotEmbeddedChoicePrompt {
  /** Optional question shown above the options (the message text usually already contains it). */
  question?: string;
  options: string[];
  /** When true the user may select several options before confirming; otherwise a tap sends immediately. */
  multiSelect: boolean;
}

/**
 * A single rendered chat message in the Copilot Embedded transcript.
 */
export interface CopilotEmbeddedChatMessage {
  message: string;
  type: 'apiMessage' | 'userMessage';
  usedTools?: CopilotEmbeddedToolCall[];
  messageId?: string;
  dateTime?: string;
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
