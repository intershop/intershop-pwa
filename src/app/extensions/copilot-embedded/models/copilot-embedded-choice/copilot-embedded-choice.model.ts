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
