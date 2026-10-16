import { CopilotEmbeddedToolCall } from '../copilot-embedded-tool-call/copilot-embedded-tool-call.model';

import { CopilotEmbeddedChoiceData } from './copilot-embedded-choice.interface';
import { CopilotEmbeddedChoicePrompt } from './copilot-embedded-choice.model';

const CHOICE_TOOL = 'PWA_ask_choice';

/** Accepts either a real array or a pipe-separated string (the resilient Flowise schema shape). */
function parseOptions(raw: unknown): string[] {
  const values = Array.isArray(raw) ? raw : typeof raw === 'string' ? raw.split('|') : [];
  return values.map(option => `${option}`.trim()).filter(Boolean);
}

export class CopilotEmbeddedChoiceMapper {
  /**
   * Maps the `PWA_ask_choice` signal tool call of a chatflow response to a choice prompt, so the PWA
   * can render the options as clickable choice chips.
   *
   * @param tools The tool calls of a chatflow response (`usedTools`).
   * @returns     The choice prompt or `undefined` when the tool was not called or carries no usable options.
   */
  static fromToolCalls(tools: CopilotEmbeddedToolCall[]): CopilotEmbeddedChoicePrompt {
    const call = tools?.find(tool => tool?.tool === CHOICE_TOOL);
    return call ? CopilotEmbeddedChoiceMapper.fromData(call.toolInput as CopilotEmbeddedChoiceData) : undefined;
  }

  private static fromData(data: CopilotEmbeddedChoiceData): CopilotEmbeddedChoicePrompt {
    const options = parseOptions(data?.options);
    if (!options.length) {
      return;
    }

    const question = typeof data.question === 'string' ? data.question.trim() : undefined;
    return {
      question: question || undefined,
      options,
      multiSelect: data.multiSelect === true || data.multiSelect === 'true',
    };
  }
}
