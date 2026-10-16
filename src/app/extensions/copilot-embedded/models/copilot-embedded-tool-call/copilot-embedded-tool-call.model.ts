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
