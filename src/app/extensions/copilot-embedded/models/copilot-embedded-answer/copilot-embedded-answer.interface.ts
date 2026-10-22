import { CopilotEmbeddedToolCall } from '../copilot-embedded-tool-call/copilot-embedded-tool-call.model';

/**
 * The response of a non-streaming Flowise prediction request
 */
export interface CopilotEmbeddedAnswerData {
  text: string;
  chatId?: string;
  chatMessageId?: string;
  usedTools?: CopilotEmbeddedToolCall[];
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
