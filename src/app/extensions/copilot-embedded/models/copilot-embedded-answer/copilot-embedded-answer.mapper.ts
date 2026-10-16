import { CopilotEmbeddedChoiceMapper } from '../copilot-embedded-choice/copilot-embedded-choice.mapper';
import { CopilotEmbeddedProductMapper } from '../copilot-embedded-product/copilot-embedded-product.mapper';
import { CopilotEmbeddedToolCall } from '../copilot-embedded-tool-call/copilot-embedded-tool-call.model';

import { CopilotEmbeddedAnswerData, CopilotEmbeddedStreamEvent } from './copilot-embedded-answer.interface';
import { CopilotEmbeddedAnswer } from './copilot-embedded-answer.model';

function isMetadata(data: unknown): data is { chatId?: string } {
  return !!data && typeof data === 'object';
}

export class CopilotEmbeddedAnswerMapper {
  static fromData(data: CopilotEmbeddedAnswerData): CopilotEmbeddedAnswer {
    return {
      text: data?.text ?? '',
      chatId: data?.chatId,
      messageId: data?.chatMessageId,
      ...CopilotEmbeddedAnswerMapper.fromToolCalls(data?.usedTools),
    };
  }

  /**
   * Adds a streamed Flowise event to the answer received so far.
   * Returns the given answer unchanged for events that do not affect it.
   */
  static fromStreamEvent(
    answer: CopilotEmbeddedAnswer,
    { event, data }: CopilotEmbeddedStreamEvent
  ): CopilotEmbeddedAnswer {
    if (event === 'token' && typeof data === 'string') {
      return { ...answer, text: answer.text + data };
    }
    if (event === 'usedTools' && Array.isArray(data)) {
      return { ...answer, ...CopilotEmbeddedAnswerMapper.fromToolCalls(data as CopilotEmbeddedToolCall[]) };
    }
    if (event === 'metadata' && isMetadata(data)) {
      return { ...answer, chatId: data.chatId ?? answer.chatId };
    }
    return answer;
  }

  private static fromToolCalls(
    usedTools: CopilotEmbeddedToolCall[]
  ): Pick<CopilotEmbeddedAnswer, 'choices' | 'products' | 'usedTools'> {
    return {
      usedTools: usedTools ?? [],
      products: CopilotEmbeddedProductMapper.fromToolCalls(usedTools),
      choices: CopilotEmbeddedChoiceMapper.fromToolCalls(usedTools),
    };
  }
}
