import { CopilotEmbeddedToolCall } from '../copilot-embedded-tool-call/copilot-embedded-tool-call.model';

/**
 * A source document returned by the chatflow (RAG context, product references, etc.).
 */
interface CopilotEmbeddedSourceDocument {
  pageContent?: string;
  metadata?: Record<string, unknown>;
}

/**
 * The response of a non-streaming Flowise prediction request
 * (`POST {apiHost}/api/v1/prediction/{chatflowid}`).
 */
export interface CopilotEmbeddedAnswerData {
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
