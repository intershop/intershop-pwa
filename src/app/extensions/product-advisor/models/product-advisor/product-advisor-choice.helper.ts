import { ProductAdvisorChoicePrompt, ProductAdvisorToolCall } from './product-advisor.model';

const CHOICE_TOOL = 'PWA_ask_choice';

/**
 * Extracts a predefined answer prompt from a chatflow's tool calls.
 *
 * Reads the `PWA_ask_choice` signal tool input (`question`, pipe-separated `options`, `multiSelect`)
 * so the PWA can render the options as clickable choice chips. Returns `undefined` when the tool was
 * not called or carries no usable options.
 *
 * @param tools The tool calls of a chatflow response (`usedTools`).
 */
export function extractChoicePromptFromToolCalls(
  tools: ProductAdvisorToolCall[] | undefined
): ProductAdvisorChoicePrompt | undefined {
  const call = (tools ?? []).find(tool => tool?.tool === CHOICE_TOOL);
  if (!call) {
    return;
  }

  const input = call.toolInput ?? {};
  const options = parseOptions(input.options);
  if (!options.length) {
    return;
  }

  const question = typeof input.question === 'string' ? input.question.trim() : undefined;
  return {
    question: question || undefined,
    options,
    multiSelect: input.multiSelect === true || input.multiSelect === 'true',
  };
}

/** Accepts either a real array or a pipe-separated string (the resilient Flowise schema shape). */
function parseOptions(raw: unknown): string[] {
  const values = Array.isArray(raw) ? raw : typeof raw === 'string' ? raw.split('|') : [];
  return values.map(option => `${option}`.trim()).filter(Boolean);
}
